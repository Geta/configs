const modes = require('../constants/modes');

module.exports = function(context, rule, forMode) {
    if (!forMode) {
        context._developmentRules.push(rule);
        context._productionRules.push(rule);
    } else if (forMode === modes.development) {
        context._developmentRules.push(rule);
    } else if (forMode === modes.production) {
        context._productionRules.push(rule);
    }
};
