/*
https://github.com/HabitRPG/habitica/blob/0dd39e2b3dd459b17afd0b4a923c0650581fac74/website/common/script/libs/statsComputed.js#L36
*/
/*import {each} from './node_modules/lodash/each';
import {get} from './node_modules/lodash/get';
import {values} from './node_modules/lodash/values';
*/
const MAX_LEVEL = 100;
function capByLevel (lvl) {
    if (lvl > MAX_LEVEL) {
      return MAX_LEVEL;
    }
    return lvl;
  }

function equipmentStatBonusComputed (stat, user,content) {
    const gear = content.gear.flat;
    let gearBonus = 0;
    let classBonus = 0;
  
    // toObject is required here due to lodash values not working well with mongoose doc objects.
    // if toObject doesn't exist, we can assume the object is already plain JSON
    // see http://stackoverflow.com/questions/25767334/underscore-js-keys-and-omit-not-working-as-expected
    const { equipped } = user.items.gear;
    const equippedKeys = _.values(!equipped.toObject ? equipped : equipped.toObject());
  
    _.each(equippedKeys, equippedItem => {
      const item = gear[equippedItem];
  
      if (item) {
        const equipmentStat = item[stat];
        const classBonusMultiplier = item.klass === user.stats.class
          || item.specialClass === user.stats.class ? 0.5 : 0;
        gearBonus += equipmentStat;
        classBonus += equipmentStat * classBonusMultiplier;
      }
    });
  
    return {
      gearBonus,
      classBonus,
    };
  }
  
  export function statsComputed (user,content) {
    const statBreakdown = {
      gearBonus: {},
      classBonus: {},
      baseStat: {},
      buff: {},
      levelBonus: {},
    };
    _.each(['per', 'con', 'str', 'int'], stat => {
      const baseStat = _.get(user, 'stats')[stat];
      const buff = _.get(user, 'stats.buffs')[stat];
      const equipmentBonus = equipmentStatBonusComputed(stat, user,content);
  
      statBreakdown[stat] = equipmentBonus.gearBonus + equipmentBonus.classBonus + baseStat + buff;
      statBreakdown[stat] += Math.floor(capByLevel(user.stats.lvl) / 2);
  
      statBreakdown.levelBonus[stat] = Math.floor(capByLevel(user.stats.lvl) / 2);
      statBreakdown.gearBonus[stat] = equipmentBonus.gearBonus;
      statBreakdown.classBonus[stat] = equipmentBonus.classBonus;
      statBreakdown.baseStat[stat] = baseStat;
      statBreakdown.buff[stat] = buff;
    });
  
    statBreakdown.maxMP = statBreakdown.int * 2 + 30;
  
    return statBreakdown;
  }