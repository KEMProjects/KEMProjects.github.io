//https://github.com/HabitRPG/habitica/blob/0dd39e2b3dd459b17afd0b4a923c0650581fac74/website/common/script/ops/scoreTask.js#L225
const MAX_TASK_VALUE = 21.27;
const MIN_TASK_VALUE = -47.27;
function _addPoints (user, task, stats, direction, delta) {
  const _crit = user._tmp.crit || 1;

  // Exp Modifier
  // ===== Intelligence =====
  // TODO Increases Experience gain by .2% per point.
  const intBonus = 1 + statsComputed(user).int * 0.025;
  stats.exp += Math.round(delta * intBonus * task.priority * _crit * 6);

  // GP modifier
  // ===== PERCEPTION =====
  // TODO Increases Gold gained from tasks by .3% per point.
  const perBonus = 1 + statsComputed(user).per * 0.02;
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

function _changeTaskValue (user, task, direction, times, cron) {
    let addToDelta = 0;
  
    // ===== CRITICAL HITS =====
    // allow critical hit only when checking off a task, not when unchecking it:
    const _crit = direction === 'up' ? crit.crit(user) : 1;
    // if there was a crit, alert the user via notification
    if (_crit > 1) user._tmp.crit = _crit;
  
    // If multiple days have passed, multiply times days missed
    timesLodash(times, () => {
      // Each iteration calculate the nextDelta, which is then accumulated in the total delta.
      const nextDelta = !cron && direction === 'down' ? _calculateReverseDelta(task, direction) : _calculateDelta(task, direction, cron);
  
      if (task.type !== 'reward') {
        if (user.preferences.automaticAllocation === true && user.preferences.allocationMode === 'taskbased' && !(task.type === 'todo' && direction === 'down')) {
          user.stats.training[task.attribute] += nextDelta;
        }
  
        if (direction === 'up') { // Make progress on quest based on STR
          user.party.quest.progress.up = user.party.quest.progress.up || 0;
          const prevProgress = user.party.quest.progress.up;
  
          if (task.type === 'todo' || task.type === 'daily') {
            user.party.quest.progress.up += nextDelta * _crit * (1 + statsComputed(user).str / 200);
          } else if (task.type === 'habit') {
            user.party.quest.progress.up += nextDelta * _crit * (0.5 + statsComputed(user).str / 400);
          }
  
          if (!user._tmp.quest) user._tmp.quest = {};
          user._tmp.quest.progressDelta = user.party.quest.progress.up - prevProgress;
        }
        task.value += nextDelta;
      }
  
      addToDelta += nextDelta;
    });
  
    return addToDelta;
  }

  function _calculateDelta (task, direction, cron) {
    // Min/max on task redness
    const currVal = _getTaskValue(task.value);
    let nextDelta = (0.9747 ** currVal) * (direction === 'down' ? -1 : 1);
  
    // Checklists
    if (task.checklist && task.checklist.length > 0) {
      // If the Daily, only dock them a portion based on their checklist completion
      if (direction === 'down' && task.type === 'daily' && cron) {
        nextDelta *= 1 - reduce(
          task.checklist,
          (m, i) => m + (i.completed ? 1 : 0),
          0,
        ) / task.checklist.length;
      }
  
      // If To Do, point-match the TD per checklist item completed
      if (task.type === 'todo' && !cron) {
        nextDelta *= 1 + reduce(task.checklist, (m, i) => m + (i.completed ? 1 : 0), 0);
      }
    }
  
    return nextDelta;
  }

  function _getTaskValue (taskValue) {
    if (taskValue < MIN_TASK_VALUE) {
      return MIN_TASK_VALUE;
    } if (taskValue > MAX_TASK_VALUE) {
      return MAX_TASK_VALUE;
    }
    return taskValue;
  }