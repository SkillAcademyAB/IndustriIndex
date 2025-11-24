import js from "@eslint/js"
import prettier from "eslint-config-prettier"

//Custom rule for underscore with custom messages
const underscoreRule = {
    meta: {
        fixable: "code",
        type: "suggestion",
        messages: {
            missingUnderscore:
                "Parameters must start with an underscore. Example: _parameterName"
        }
    },
    create(_context) 
    {
        return {
            FunctionDeclaration(_node) 
            {
                processParams(_node.params, _context)
            },
            ArrowFunctionExpression(_node) 
            {
                processParams(_node.params, _context)
            },
            FunctionExpression(_node) 
            {
                processParams(_node.params, _context)
            }
        }

        function processParams(_params, _context) 
        {
            _params.forEach((_param) => 
            {
                if(
                    _param.type === "Identifier" &&
                    !_param.name.startsWith("_")
                ) 
                {
                    _context.report({
                        node: _param,
                        messageId: "missingUnderscore"
                        //Parameter prefix with underscore (manually fix)
                    })
                }
            })
        }
    }
}

//Custom rule for brace-style with custom message
export const customBraceStyle = {
    meta: {
        type: "layout",
        messages: {
            wrongBraceStyle: "Curly braces must be on a new line (Allman style)"
        }
    },
    create(_context) 
    {
        return {
            BlockStatement(_node) 
            {
                const sourceCode = _context.getSourceCode()
                const openingBrace = sourceCode.getFirstToken(_node)
                const previousToken = sourceCode.getTokenBefore(openingBrace)

                if(
                    previousToken &&
                    previousToken.loc.end.line === openingBrace.loc.start.line
                ) 
                {
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
        //Ignore files (replaces .eslintignore)
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

    //Config files - no underscore rules here!
    {
        files: ["**/eslint.config.js"],
        rules: {
            "no-unused-vars": "off", //Disable unused vars
            "prefer-const": "off", //Disable prefer-const
            "no-var": "off", //Disable no-var
            "custom/underscore-rule": "off",
            "custom/custom-brace-style": "off"
        }
    },

    //Base configuration
    js.configs.recommended,

    //Prettier config (must be last)
    prettier,

    //--> underscore rules enabled here!
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
            //Curly braces on a new line (Allman-style). Built-in
            "brace-style": ["error", "allman"],

            //Parameter-prefix with underscore
            //Use our custom rule message instead of id-match
            "custom/underscore-rule": "error",
            "custom/custom-brace-style": "error",

            //Additional useful rules
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
                    "custom-brace-style": customBraceStyle
                }
            }
        }
    }
]
