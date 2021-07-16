/**
 * Functions modified from Habitica Task scoring functions
 * https://github.com/HabitRPG/habitica/blob/0dd39e2b3dd459b17afd0b4a923c0650581fac74/website/common/script/ops/scoreTask.js#L225
const [taskResponse] = await scoreTasks(user, [{ id: taskId, direction }], req, res);

  const {
    user, task, direction, times = 1, cron = false,
  } = options;

*/

/*import {reduce} from './node_modules/lodash/reduce';*/
import {statsComputed} from './calcStats.js';


const MAX_TASK_VALUE = 21.27;
const MIN_TASK_VALUE = -47.27;
var content;
function _getTaskValue (taskValue) {
    if (taskValue < MIN_TASK_VALUE) {
      return MIN_TASK_VALUE;
    } if (taskValue > MAX_TASK_VALUE) {
      return MAX_TASK_VALUE;
    }
    return taskValue;
  }
// Calculates the next task.value based on direction
// Uses a capped inverse log y=.95^x, y>= -5
function _calculateDelta (task, direction, cron) {
    // Min/max on task redness
    const currVal = _getTaskValue(task.value);
    let nextDelta = (0.9747 ** currVal) * (direction === 'down' ? -1 : 1);
  
    // Checklists
    if (task.checklist && task.checklist.length > 0) {
      // If the Daily, only dock them a portion based on their checklist completion
      if (direction === 'down' && task.type === 'daily' && cron) {
        nextDelta *= 1 - _.reduce(
          task.checklist,
          (m, i) => m + (i.completed ? 1 : 0),
          0,
        ) / task.checklist.length;
      }
  
      // If To Do, point-match the TD per checklist item completed
      if (task.type === 'todo' && !cron) {
        nextDelta *= 1 + _.reduce(task.checklist, (m, i) => m + (i.completed ? 1 : 0), 0);
      }
    }
  
    return nextDelta;
  }

function _changeTaskValue (user, task, direction, times, cron) {
    let nextDelta = _calculateDelta(task, direction, cron);
    return nextDelta;
}

function _addPoints (user, task, stats, direction, delta) {
    const _crit = 1;

    // Exp Modifier
    // ===== Intelligence =====
    // TODO Increases Experience gain by .2% per point.
    const intBonus = 1 + statsComputed(user,content).int * 0.025;
    stats.exp += Math.round(delta * intBonus * task.priority * _crit * 6);

    // GP modifier
    // ===== PERCEPTION =====
    // TODO Increases Gold gained from tasks by .3% per point.
    const perBonus = 1 + statsComputed(user,content).per * 0.02;
    const gpMod = delta * task.priority * _crit * perBonus;

    if (task.streak) {
        const currStreak = direction === 'down' ? task.streak - 1 : task.streak;
        const streakBonus = currStreak / 100 + 1; // eg, 1-day streak is 1.01, 2-day is 1.02, etc
        const afterStreak = gpMod * streakBonus;
        if (currStreak > 0 && gpMod > 0) {
        // keep this on-hand for later, so we can notify streak-bonus
        user._tmp.streakBonus = afterStreak - gpMod;
        }

        stats.gp += afterStreak;
    } else {
        stats.gp += gpMod;
    }
}

function calcTaskValue (user,task,direction) {
    let times = 1;
    let cron=false;
    let delta = 0;
    const stats = {
        gp: user.stats.gp,
        hp: user.stats.hp,
        exp: user.stats.exp,
    };

    if (task.type === 'habit') {
        delta += _changeTaskValue(user, task, direction, times, cron);
        // Add habit value to habit-history (if different)
        if (delta > 0) {
            _addPoints(user, task, stats, direction, delta);
        } 
    } else if (task.type === 'daily') {
        if (!cron) {
            delta += _changeTaskValue(user, task, direction, times, cron);
            _addPoints(user, task, stats, direction, delta);
        }
    } else if (task.type === 'todo') {
        if (!cron){
            delta += _changeTaskValue(user, task, direction, times, cron);
            _addPoints(user, task, stats, direction, delta);
        }
    } 
    return stats;
}

export function calcRewardStr(user,task,direction,globalData){
  content=globalData;
  let currGp = user.stats.gp;
  let currExp = user.stats.exp;
  let rewardStr = "";
  let newStats = calcTaskValue(user,task,direction);
  if(currGp-newStats.gp>0){
    let diff=currGp-newStats.gp;
    rewardStr+=diff.toFixed(2)+" G ";
  }
  if(currExp-newStats.exp>0){
    let diff=currExp-newStats.exp;
    rewardStr+=diff.toFixed(2)+" exp";
  }
  return rewardStr;
}