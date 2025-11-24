import js from "@eslint/js"
import prettier from "eslint-config-prettier"

//Custom rule för underscore med egna meddelanden
const underscoreRule = {
    meta: {
        fixable: "code",
        type: "suggestion",
        messages: {
            missingUnderscore:
                "Parameters must start with an underscore. Example: _parameterName"
        }
    },
    create(_context) {
        return {
            FunctionDeclaration(_node) {
                processParams(_node.params, _context)
            },
            ArrowFunctionExpression(_node) {
                processParams(_node.params, _context)
            },
            FunctionExpression(_node) {
                processParams(_node.params, _context)
            }
        }

        function processParams(_params, _context) {
            _params.forEach((_param) => {
                if (
                    _param.type === "Identifier" &&
                    !_param.name.startsWith("_")
                ) {
                    _context.report({
                        node: _param,
                        messageId: "missingUnderscore"
                        //Parameter-prefix med underscore (manuellt fixa)
                        /*fix(_fixer) 
                        {
                            return _fixer.replaceText(_param, `_${_param.name}`)
                        }*/
                    })
                }
            })
        }
    }
}

//Custom rule för brace-style med custom message
export const customBraceStyle = {
    meta: {
        type: "layout",
        messages: {
            wrongBraceStyle: "Curly braces must be on a new line (Allman style)"
        }
    },
    create(_context) {
        return {
            BlockStatement(_node) {
                const sourceCode = _context.getSourceCode()
                const openingBrace = sourceCode.getFirstToken(_node)
                const previousToken = sourceCode.getTokenBefore(openingBrace)

                if (
                    previousToken &&
                    previousToken.loc.end.line === openingBrace.loc.start.line
                ) {
                    _context.report({
                        node: openingBrace,
                        messageId: "wrongBraceStyle"
                    })
                }
            }
        }
    }
}

export default [
    //Global ignores
    {
        //Ignorera filer (ersätter .eslintignore)
        ignores: [
            "node_modules/",
            "dist/",
            "*.min.js",
            "coverage/",
            "build/",
            ".git/",
            "package-lock.json",
            "yarn.lock"
        ]
    },

    //CONFIG FILES - INGA underscore regler här!
    {
        files: ["**/eslint.config.js"],
        rules: {
            //"id-match": "off",         //--> Stäng av underscore regeln för config filer
            "no-unused-vars": "off", //Stäng av unused vars
            "prefer-const": "off", //Stäng av prefer-const
            "no-var": "off", //Stäng av no-var
            "custom/underscore-rule": "off",
            "custom/brace-style": "off"
        }
    },

    //Grundkonfiguration
    js.configs.recommended,

    //Prettier config (måste vara sist)
    prettier,

    //--> underscore regler aktiverade här!
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                browser: true,
                es2021: true
            }
        },
        rules: {
            //Måsvingar på ny rad (Allman-style)
            "brace-style": ["error", "allman"],

            //Parameter-prefix med underscore (Automatiskt fixa)
            //"custom-rules/add-underscore": "error",
            //Använd vår custom rule istället för id-match
            "custom/underscore-rule": "error",
            "custom/brace-style": "error",

            //Parameter-prefix med underscore (manuellt fixa)
            //ID-MATCH STÄNGS AV - vill inte ha underscore på variabler!
            /*"id-match": ["error", "^_[a-zA-Z][a-zA-Z0-9]*$", {
                properties: false, 
                onlyDeclarations: true, //false,
                ignoreDestructuring: true,
                //message: "Parameters must start with an underscore. Example: _parameterName"
            }],*/

            //Ytterligare bra regler
            "no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                    //message: "Unused variables must start with underscore or be removed"
                }
            ],
            "prefer-const": "error", //message: "Use const instead of let for variables that don't get reassigned"
            "no-var": "error" //message: "Use let or const instead of var"
        },
        plugins: {
            custom: {
                rules: {
                    "underscore-rule": underscoreRule,
                    "brace-style": customBraceStyle
                }
            }
        }
    }
]
