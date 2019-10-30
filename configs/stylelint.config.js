module.exports = {
    "extends": "stylelint-config-standard",
    "plugins": [
        "stylelint-scss"
    ],
    "rules": {
        "indentation": 4,
        "no-missing-end-of-source-newline": null,
        "property-no-unknown": null,
        "selector-pseudo-element-colon-notation": "single",
        "at-rule-no-unknown": null,
        "scss/at-rule-no-unknown": [true, {
            ignoreAtRules: ['util'],
        }],
        "at-rule-empty-line-before": [
            "always",
            {
                "except": ["blockless-after-same-name-blockless"],
                "ignore": ["after-comment", "first-nested"],
                "severity": "warning"
            }
        ],
        "custom-property-empty-line-before": [
            "always",
            {
                "except": ["after-custom-property"],
                "ignore": ["after-comment", "first-nested", "inside-single-line-block"],
                "severity": "warning"
            }
        ],
        "declaration-empty-line-before": [
            "always",
            {
                "except": ["after-declaration"],
                "ignore": ["after-comment", "first-nested", "inside-single-line-block"],
                "severity": "warning"
            }
        ],
        "rule-empty-line-before": [
            "always",
            {
                "ignore": ["after-comment", "first-nested"],
                "severity": "warning"
            }
        ]
    }
};