/*
    Model is responsible for Validate Metadata tables (Flow 2.0)
    initialize interface inputs: elements from <div class="formularContainer">
*/
window.Rigsarkiv = window.Rigsarkiv || {},
function (n) {
    Rigsarkiv.Nemesis = Rigsarkiv.Nemesis || {},
    function (n) {
        const {ipcRenderer} = require('electron');
        const fs = require('fs');
        const chardet = require('chardet');

        const startNumberPattern = /^([0-9])([a-zA-ZæøåÆØÅ0-9_]*)$/;
        const validFileNamePattern = /^([a-zA-ZæøåÆØÅ])([a-zA-ZæøåÆØÅ0-9_]*)$/;
        const reservedWordPattern = /^(ABSOLUTE|ACTION|ADD|ADMIN|AFTER|AGGREGATE|ALIAS|ALL|ALLOCATE|ALTER|AND|ANY|ARE|ARRAY|AS|ASC|ASSERTION|AT|AUTHORIZATION|BEFORE|BEGIN|BINARY|BIT|BLOB|BOOLEAN|BOTH|BREADTH|BY|CALL|CASCADE|CASCADED|CASE|CAST|CATALOG|CHAR|CHARACTER|CHECK|CLASS|CLOB|CLOSE|COLLATE|COLLATION|COLUMN|COMMIT|COMPLETION|CONNECT|CONNECTION|CONSTRAINT|CONSTRAINTS ||CONSTRUCTOR|CONTINUE|CORRESPONDING|CREATE|CROSS|CUBE|CURRENT|CURRENT_DATE|CURRENT_PATH|CURRENT_ROLE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|CYCLE|DATA|DATE|DAY|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFERRABLE|DEFERRED|DELETE|DEPTH|DEREF|DESC|DESCRIBE|DESCRIPTOR|DESTROY|DESTRUCTOR|DETERMINISTIC|DICTIONARY|DIAGNOSTICS|DISCONNECT|DISTINCT|DOMAIN|DOUBLE|DROP|DYNAMIC|EACH|ELSE|END|END-EXEC|EQUALS|ESCAPE|EVERY|EXCEPT|EXCEPTION|EXEC|EXECUTE|EXTERNAL|FALSE|FETCH|FIRST|FLOAT|FOR|FOREIGN|FOUND|FROM|FREE|FULL|FUNCTION|GENERAL|GET|GLOBAL|GO|GOTO|GRANT|GROUP|GROUPING|HAVING|HOST|HOUR|IDENTITY|IGNORE|IMMEDIATE|IN|INDICATOR|INITIALIZE|INITIALLY|INNER|INOUT|INPUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|IS|ISOLATION|ITERATE|JOIN|KEY|LANGUAGE|LARGE|LAST|LATERAL|LEADING|LEFT|LESS|LEVEL|LIKE|LIMIT|LOCAL|LOCALTIME|LOCALTIMESTAMP|LOCATOR|MAP|MATCH|MINUTE|MODIFIES|MODIFY|MODULE|MONTH|NAMES|NATIONAL|NATURAL|NCHAR|NCLOB|NEW|NEXT|NO|NONE|NOT|NULL|NUMERIC|OBJECT|OF|OFF|OLD|ON|ONLY|OPEN|OPERATION|OPTION|OR|ORDER|ORDINALITY|OUT|OUTER|OUTPUT|PAD|PARAMETER|PARAMETERS|PARTIAL|PATH|POSTFIX|PRECISION|PREFIX|PREORDER|PREPARE|PRESERVE|PRIMARY|PRIOR|PRIVILEGES|PROCEDURE|PUBLIC|READ|READS|REAL|RECURSIVE|REF|REFERENCES|REFERENCING|RELATIVE|RESTRICT|RESULT|RETURN|RETURNS|REVOKE|RIGHT|ROLE|ROLLBACK|ROLLUP|ROUTINE|ROW|ROWS|SAVEPOINT|SCHEMA|SCROLL|SCOPE|SEARCH|SECOND|SECTION|SELECT|SEQUENCE|SESSION|SESSION_USER|SET|SETS|SIZE|SMALLINT|SOME|SPACE|SPECIFIC|SPECIFICTYPE|SQL|SQLEXCEPTION|SQLSTATE|SQLWARNING|START|STATE|STATEMENT|STATIC|STRUCTURE|SYSTEM_USER|TABLE|TEMPORARY|TERMINATE|THAN|THEN|TIME|TIMESTAMP|TIMEZONE_HOUR|TIMEZONE_MINUTE|TO|TRAILING|TRANSACTION|TRANSLATION|TREAT|TRIGGER|TRUE|UNDER|UNION|UNIQUE|UNKNOWN|UNNEST|UPDATE|USAGE|USER|USING|VALUE|VALUES|VARCHAR|VARIABLE|VARYING|VIEW|WHEN|WHENEVER|WHERE|WITH|WITHOUT|WORK|WRITE|YEAR|ZONE)$/i;
        const enclosedReservedWordPattern = /^(")(ABSOLUTE|ACTION|ADD|ADMIN|AFTER|AGGREGATE|ALIAS|ALL|ALLOCATE|ALTER|AND|ANY|ARE|ARRAY|AS|ASC|ASSERTION|AT|AUTHORIZATION|BEFORE|BEGIN|BINARY|BIT|BLOB|BOOLEAN|BOTH|BREADTH|BY|CALL|CASCADE|CASCADED|CASE|CAST|CATALOG|CHAR|CHARACTER|CHECK|CLASS|CLOB|CLOSE|COLLATE|COLLATION|COLUMN|COMMIT|COMPLETION|CONNECT|CONNECTION|CONSTRAINT|CONSTRAINTS ||CONSTRUCTOR|CONTINUE|CORRESPONDING|CREATE|CROSS|CUBE|CURRENT|CURRENT_DATE|CURRENT_PATH|CURRENT_ROLE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|CYCLE|DATA|DATE|DAY|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFERRABLE|DEFERRED|DELETE|DEPTH|DEREF|DESC|DESCRIBE|DESCRIPTOR|DESTROY|DESTRUCTOR|DETERMINISTIC|DICTIONARY|DIAGNOSTICS|DISCONNECT|DISTINCT|DOMAIN|DOUBLE|DROP|DYNAMIC|EACH|ELSE|END|END-EXEC|EQUALS|ESCAPE|EVERY|EXCEPT|EXCEPTION|EXEC|EXECUTE|EXTERNAL|FALSE|FETCH|FIRST|FLOAT|FOR|FOREIGN|FOUND|FROM|FREE|FULL|FUNCTION|GENERAL|GET|GLOBAL|GO|GOTO|GRANT|GROUP|GROUPING|HAVING|HOST|HOUR|IDENTITY|IGNORE|IMMEDIATE|IN|INDICATOR|INITIALIZE|INITIALLY|INNER|INOUT|INPUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|IS|ISOLATION|ITERATE|JOIN|KEY|LANGUAGE|LARGE|LAST|LATERAL|LEADING|LEFT|LESS|LEVEL|LIKE|LIMIT|LOCAL|LOCALTIME|LOCALTIMESTAMP|LOCATOR|MAP|MATCH|MINUTE|MODIFIES|MODIFY|MODULE|MONTH|NAMES|NATIONAL|NATURAL|NCHAR|NCLOB|NEW|NEXT|NO|NONE|NOT|NULL|NUMERIC|OBJECT|OF|OFF|OLD|ON|ONLY|OPEN|OPERATION|OPTION|OR|ORDER|ORDINALITY|OUT|OUTER|OUTPUT|PAD|PARAMETER|PARAMETERS|PARTIAL|PATH|POSTFIX|PRECISION|PREFIX|PREORDER|PREPARE|PRESERVE|PRIMARY|PRIOR|PRIVILEGES|PROCEDURE|PUBLIC|READ|READS|REAL|RECURSIVE|REF|REFERENCES|REFERENCING|RELATIVE|RESTRICT|RESULT|RETURN|RETURNS|REVOKE|RIGHT|ROLE|ROLLBACK|ROLLUP|ROUTINE|ROW|ROWS|SAVEPOINT|SCHEMA|SCROLL|SCOPE|SEARCH|SECOND|SECTION|SELECT|SEQUENCE|SESSION|SESSION_USER|SET|SETS|SIZE|SMALLINT|SOME|SPACE|SPECIFIC|SPECIFICTYPE|SQL|SQLEXCEPTION|SQLSTATE|SQLWARNING|START|STATE|STATEMENT|STATIC|STRUCTURE|SYSTEM_USER|TABLE|TEMPORARY|TERMINATE|THAN|THEN|TIME|TIMESTAMP|TIMEZONE_HOUR|TIMEZONE_MINUTE|TO|TRAILING|TRANSACTION|TRANSLATION|TREAT|TRIGGER|TRUE|UNDER|UNION|UNIQUE|UNKNOWN|UNNEST|UPDATE|USAGE|USER|USING|VALUE|VALUES|VARCHAR|VARIABLE|VARYING|VIEW|WHEN|WHENEVER|WHERE|WITH|WITHOUT|WORK|WRITE|YEAR|ZONE)(")$/i;
        const codePattern = /^('(((\+|\-){0,1}[0-9]+)|([a-zA-ZæøåÆØÅ0-9]+)|(\.[a-zA-ZæøåÆØÅ])|((\+|\-){0,1}[0-9]+(\.|\,){0,1}[0-9]*))' '[\w\W\s]*')$/;
        const userCodePattern = /^('(((\+|\-){0,1}[0-9]+)|([a-zA-ZæøåÆØÅ0-9]+)|((\+|\-){0,1}[0-9]+(\.|\,){0,1}[0-9]*))')$/;
        const datatypeString = [/^(string)$/,/^(\%([0-9]+)s)$/,/^(\$([0-9]+)\.)$/,/^(a([0-9]+))$/];
        const datatypeInt = [/^(int)$/,/^((\%([0-9]+)\.0f)|(\%([0-9]+)\.0g))$/,/^(f([0-9]+)\.)$/,/^(f([0-9]+))$/];
        const datatypeDecimal = [/^(decimal)$/,/^((\%([0-9]+)\.([0-9]+f))|(\%([0-9]+)\.([0-9]+)g))$/,/^(f([0-9]+)\.([0-9]+))$/,/^(f([0-9]+)\.([0-9]+))$/];
        const datatypeDate = [/^(date)$/,/^(\%tdCCYY-NN-DD)$/,/^((yymmdd\.)|(yymmdd10\.))$/,/^(sdate10)$/];
        const datatypeTime = [/^(time)$/,/^(\%tcHH:MM:SS)$/,/^((time\.)|(time8\.))$/,/^(time8)$/];
        const datatypeDateTime = [/^(datetime)$/,/^(\%tcCCYY-NN-DD\!THH:MM:SS)$/,/^((e8601dt\.)|(e8601dt19\.))$/,/^(datetime20)$/];
        const titleMaxLength = 128;
        const stringMaxLength = 32767;
            
        //private data memebers
        var settings = { 
            outputErrorSpn: null,
            outputErrorText: null,
            outputPrefix: null,
            logCallback: null,
            logStartSpn: null,
            logEndNoErrorSpn: null,
            logEndWithErrorSpn:null,
            deliveryPackagePath: null,
            outputText: {},
            logType: "metadata",
            fileName: null,
            fileKeys: [],
            fileReferences: [],
            errorsCounter: 0,
            errorStop: false,
            dataPathPostfix: "Data",
            metadataLabels: ["SYSTEMNAVN","DATAFILNAVN","DATAFILBESKRIVELSE","NØGLEVARIABEL","REFERENCE","VARIABEL","VARIABELBESKRIVELSE","KODELISTE","BRUGERKODE"],
            data: []
        }

        //output system error messages
        var HandleError = function(err) {
            console.log(`Error: ${err}`);
            settings.outputErrorSpn.hidden = false;
            settings.outputErrorSpn.innerHTML = settings.outputErrorText.format(err.message);
        }

        // get selected folder name 
        var GetFolderName = function() {
            var folders = settings.deliveryPackagePath.getFolders();
            return folders[folders.length - 1];
        }
        // View Element by id & return texts
        var ViewElement = function(id,formatText1,formatText2,formatText3) {
            var result = settings.outputText[id];
            if(formatText1 != null) { 
                if(formatText2 != null) {
                    if(formatText3 != null) {
                        result = result.format(formatText1,formatText2,formatText3);
                    }
                    else {
                        result = result.format(formatText1,formatText2);
                    }
                }
                else {
                    result = result.format(formatText1);
                } 
            }

            var element = $("span#{0}".format(id));            
            if(result != null) {
                element.html(element.html() + result);
            }
            element.show();

            return result;
        }

        //handle error logging + HTML output
        var LogError = function(postfixId) {
            var id = "{0}{1}".format(settings.outputPrefix,postfixId);
            var text = null;
            if (arguments.length > 1) {                
                if(arguments.length === 2) { text = ViewElement(id,arguments[1],null,null); }
                if(arguments.length === 3) { text = ViewElement(id,arguments[1],arguments[2],null); }
                if(arguments.length === 4) { text = ViewElement(id,arguments[1],arguments[2],arguments[3]); }
            }

            settings.logCallback().error(settings.logType,GetFolderName(),text);
            settings.errorsCounter += 1;
            return false;
        }

        //Handle warn logging
        var LogWarn = function(postfixId) {
            var id = "{0}{1}".format(settings.outputPrefix,postfixId);
            var text = null;
            if (arguments.length > 1) {                
                if(arguments.length === 2) { text = ViewElement(id,arguments[1],null,null); }
                if(arguments.length === 3) { text = ViewElement(id,arguments[1],arguments[2],null); }
                if(arguments.length === 4) { text = ViewElement(id,arguments[1],arguments[2],arguments[3]); }
            }

            settings.logCallback().warn(settings.logType,GetFolderName(),text);
        }
        
        //Handle info logging
        var LogInfo = function(postfixId) {
            var id = "{0}{1}".format(settings.outputPrefix,postfixId);
            var text = null;
            if (arguments.length > 1) {                
                if(arguments.length === 2) { text = ViewElement(id,arguments[1],null,null); }
                if(arguments.length === 3) { text = ViewElement(id,arguments[1],arguments[2],null); }
                if(arguments.length === 4) { text = ViewElement(id,arguments[1],arguments[2],arguments[3]); }
            }

            settings.logCallback().info(settings.logType,GetFolderName(),text);
        }

        //get data JSON table object pointer by table file name
        var GetTableData = function (fileName) {
            var result = null;
            settings.data.forEach(table => {
                if(table.fileName === fileName) {
                    result = table;
                }
            });
            return result;
        }
        
        //Validate single user code name
        var ValidateUserCodeName = function (codeName) {
            var result = true;
            if(result && startNumberPattern.test(codeName)) {
                result = LogError("-CheckMetadata-FileUserCodes-NameNumber-Error",settings.fileName,codeName);
            }
            if(result && !validFileNamePattern.test(codeName) && !enclosedReservedWordPattern.test(codeName)) {
                result = LogError("-CheckMetadata-FileUserCodes-NameValidation-Error",settings.fileName,codeName);
            }
            if(result && codeName.length > titleMaxLength) {
                result = LogError("-CheckMetadata-FileUserCodes-NameLength-Error",settings.fileName,codeName);
            }
            if(result && reservedWordPattern.test(codeName)) {
                result = LogError("-CheckMetadata-FileUserCodes-NameReservedWord-Error",settings.fileName,codeName);
            }
            return result;
        }

        // get user code one line info as JSON
        var GetUserCode = function (line) {
            var name = null;
            var codes = null;
            var index = line.reduceWhiteSpace().indexOf(" "); 
            if(index < 0) {
                name = line;
            } 
            else {
                name = line.substring(0,index);
                var codesTemp = line.substring(index + 1);
                codes = [];
                codesTemp.reduceWhiteSpace().split(" ").forEach(code => {                    
                    codes.push(code);
                });
            }
            return { "name":name, "codes":codes}
        }

        //Validate BRUGERKODE
        var ValidateUserCodes = function (lines,startIndex) {
            var result = true;
            var table = GetTableData(settings.fileName);
            var variables = [];
            table.variables.forEach(variable => variables.push(variable.name));
            var i = startIndex;                        
            do {
                var info = GetUserCode(lines[i]);
                if(info.codes != null && info.codes.length > 0) {
                    if(!ValidateUserCodeName(info.name)) {
                        settings.errorStop = true;
                        result = false; 
                    }
                    else {
                        if(!variables.includes(info.name)) {
                            result = LogError("-CheckMetadata-FileUserCodes-KeyRequired-Error",settings.fileName,info.name);
                        }
                        else {
                            info.codes.forEach(code => {
                                if(!userCodePattern.test(code)) {
                                    settings.errorStop = true;
                                    result = LogError("-CheckMetadata-FileUserCodes-CodeValidation-Error",settings.fileName,info.name,code);
                                }
                                else {
                                    table.variables.forEach(variable => {
                                        if(variable.name === info.name) {
                                            variable.options.forEach(option => {
                                                if(option.name === code.substring(1,code.length - 1)) { option.missing = true; }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }               
                }
                else {
                    result = LogError("-CheckMetadata-FileUserCodes-CodeRequired-Error",settings.fileName,(i + 1));                    
                }
                i++;
            }
            while (lines[i].trim() !== ""); 
            return result;
        }

        //Validate single code name
        var ValidateCodeName = function (codeName) {
            var result = true;
            if(result && startNumberPattern.test(codeName)) {
                result = LogError("-CheckMetadata-FileCodeList-NameNumber-Error",settings.fileName,codeName);
            }
            if(result && !validFileNamePattern.test(codeName) && !enclosedReservedWordPattern.test(codeName)) {
                result = LogError("-CheckMetadata-FileCodeList-NameValidation-Error",settings.fileName,codeName);
            }
            if(result && codeName.length > titleMaxLength) {
                result = LogError("-CheckMetadata-FileCodeList-NameLength-Error",settings.fileName,codeName);
            }
            if(result && reservedWordPattern.test(codeName)) {
                result = LogError("-CheckMetadata-FileCodeList-NameReservedWord-Error",settings.fileName,codeName);
            }
            return result;
        }

        //Validate KODELISTE
        var ValidateCodeList = function (lines,startIndex) {
            var result = true;
            var table = GetTableData(settings.fileName);
            var variables = [];
            table.variables.forEach(variable => variables.push(variable.name));
            var i = startIndex;                        
            do {
                var expressions = lines[i].trim().reduceWhiteSpace().split(" ");
                if(expressions.length === 1 && expressions[0].indexOf("'") < 0) {
                    codeName = expressions[0];
                    if(!ValidateCodeName(codeName)) 
                    { 
                        settings.errorStop = true;
                        result = false; 
                        codeName = null;
                    }
                    else {
                       if(!variables.includes(codeName)) {
                            result = LogError("-CheckMetadata-FileCodeList-KeyRequired-Error",settings.fileName,codeName);
                            codeName = null;
                       }
                    }
                }
                else {
                    if(codeName != null) {
                        if(!codePattern.test(lines[i].trim().reduceWhiteSpace())) { 
                            result = LogError("-CheckMetadata-FileCodeList-CodeValidation-Error",settings.fileName,codeName,(i + 1));
                        }
                        else {
                            var options = lines[i].trim().reduceWhiteSpace().split("' '");
                            table.variables.forEach(variable => {
                                if(variable.name === codeName) {
                                    variable.options.push({ "name":options[0].substring(1), "description":options[1].substring(0,options[1].length - 1), "missing":false });
                                }
                            });
                       }
                    }                    
                }
                i++;
            }
            while (lines[i].trim() !== "");   
            return result;
        }

        //get Variable Description line as JSON
        var GetVariableDescription = function (line) {
            var name = null;
            var description = null;
            var index = line.reduceWhiteSpace().indexOf(" "); 
            if(index < 0) {
                name = line;
            } 
            else {
                name = line.substring(0,index);
                var descriptionTemp = line.substring(index + 1);
                if(descriptionTemp.length > 2 && descriptionTemp[0] === "'" && descriptionTemp[descriptionTemp.length - 1] === "'") {
                    description = descriptionTemp.substring(1,descriptionTemp.length - 1);
                }
                else {
                    description = "";
                }
            }
            return { "name":name, "description":description}
        }

        //validate variables Description, update output data json
        var ValidateVariablesDescription = function (lines,startIndex) {
            var result = true;
            var table = GetTableData(settings.fileName);
            var variableDescriptions = [];
            table.variables.forEach(variable => variableDescriptions.push(variable.name));
            var i = startIndex;
            do {          
                var info = GetVariableDescription(lines[i]);                
                var exitsCounter = 0;
                if(variableDescriptions.includes(info.name)) {
                    variableDescriptions.splice(variableDescriptions.indexOf(info.name),1);
                    table.variables.forEach(variable => {
                        if(variable.name === info.name && info.description != null) {
                            exitsCounter++ 
                            variable.description = info.description;
                            if(info.description === "") {
                                result = LogError("-CheckMetadata-FileVariable-DescriptionFormat-Error",settings.fileName,info.name);
                            }
                        }
                    });                    
                    if(exitsCounter === 0) {
                        result = LogError("-CheckMetadata-FileVariable-DescriptionRequired-Error",settings.fileName,info.name);
                    }
                }                              
                i++;
            }
            while (lines[i].trim() !== "");
            if(variableDescriptions.length > 0) {
                variableDescriptions.forEach(variable => {
                    result = LogError("-CheckMetadata-FileVariable-DescriptionExists-Error",settings.fileName,variable);
                });                
            }  
            return result;
        }

        //Validate single variable name
        var ValidateVariableName = function (variableName) {
            var result = true;
            if(result && startNumberPattern.test(variableName)) {
                result = LogError("-CheckMetadata-FileVariable-NameNumber-Error",settings.fileName,variableName);
            }
            if(result && !validFileNamePattern.test(variableName) && !enclosedReservedWordPattern.test(variableName)) {
                result = LogError("-CheckMetadata-FileVariable-NameValidation-Error",settings.fileName,variableName);
            }
            if(result && variableName.length > titleMaxLength) {
                result = LogError("-CheckMetadata-FileVariable-NameLength-Error",settings.fileName,variableName);
            }
            if(result && reservedWordPattern.test(variableName)) {
                result = LogError("-CheckMetadata-FileVariable-NameReservedWord-Error",settings.fileName,variableName);
            }
            return result;
        }

        //Validate related Variables Keys & refernces
        var ValidateVariablesRelated = function(variables) {
            var result = true;
            var table = GetTableData(settings.fileName);
            settings.fileKeys.forEach(key => {
                if(!variables.includes(key)) {
                    result = LogError("-CheckMetadata-FileVariables-KeyRequired-Error",settings.fileName,key);
                }
            });
            settings.fileReferences.forEach(ref => {
                if(!variables.includes(ref.refKey)) {
                    result = LogError("-CheckMetadata-FileReferences-KeyRequired-Error",settings.fileName,refKey);
                }
                else {
                    table.variables.forEach(variable => {
                        if(variable.name === ref.refKey) {
                            variable.refData = ref.table;
                            variable.refVariable = ref.key;
                        }
                    }); 
                }
            });
            return result;
        }

        //validate variables, update output data json
        var ValidateVariables = function (lines,startIndex) {
            var result = true;
            var table = GetTableData(settings.fileName);
            var variables = [];
            var i = startIndex;
            do {
                var expressions = lines[i].trim().reduceWhiteSpace().split(" ");
                if(expressions.length >= 2 && expressions[0] !== "" && expressions[1] !== "") {
                    var variableName = expressions[0];
                    if(!variables.includes(variableName)) {
                        variables.push(variableName);
                        if(ValidateVariableName(variableName)) {
                            var isKey = (settings.fileKeys.includes(variableName)) ? true : false;
                            var variable = { "name":variableName, "format":expressions[1], "isKey":isKey, "type":"", "description":"", "refData":"", "refVariable":"", "options":[], "regExps":[], "appliedRegExp":-1 }
                            table.variables.push(variable);
                        } 
                        else { result = false; }                       
                    }
                    else {
                        result = LogError("-CheckMetadata-FileVariables-RowDouble-Error",settings.fileName,(i + 1));
                        settings.errorStop = true;
                    }
                }
                else {
                    result = LogError("-CheckMetadata-FileVariables-RowRequiredInfo-Error",settings.fileName,(i + 1));
                    settings.errorStop = true;
                }
                i++;
            }
            while (lines[i].trim() !== "");           
            if(!ValidateVariablesRelated(variables)) { result = false; }  
            return result;
        }

        //validate keys variables array
        var ValidateKeys  = function (lines,startIndex) {
            var result = true;
            lines[startIndex].trim().split(" ").forEach(key => {
                if(startNumberPattern.test(key)) {
                    result = LogError("-CheckMetadata-FileLabel-KeyNumber-Error",settings.fileName,key);
                }
                if(result && !validFileNamePattern.test(key) && !enclosedReservedWordPattern.test(key)) {                   
                    result = LogError("-CheckMetadata-FileLabel-KeyValidation-Error",settings.fileName,key); 
                }
                if(result && key.length > titleMaxLength) {
                    result = LogError("-CheckMetadata-FileLabel-KeyLength-Error",settings.fileName,key);
                }
                if(result && reservedWordPattern.test(key)) {
                    result = LogError("-CheckMetadata-FileLabel-KeyReservedWord-Error",settings.fileName,key);
                }
                if(result) {
                    settings.fileKeys.push(key);
                }
            });
            return result;
        }
        
        //Validate Reference table Name
        var ValidateReferenceName = function (referenceName) {
            var result = true;
            if(result && startNumberPattern.test(referenceName)) {
                result = LogError("-CheckMetadata-FileReference-NameNumber-Error",settings.fileName,referenceName);
            }
            if(result && !validFileNamePattern.test(referenceName) && !enclosedReservedWordPattern.test(referenceName)) {
                result = LogError("-CheckMetadata-FileReference-NameValidation-Error",settings.fileName,referenceName);
            }
            if(result && referenceName.length > titleMaxLength) {
                result = LogError("-CheckMetadata-FileReference-NameLength-Error",settings.fileName,referenceName);
            }
            if(result && reservedWordPattern.test(referenceName)) {
                result = LogError("-CheckMetadata-FileReference-NameReservedWord-Error",settings.fileName,referenceName);
            }
            return result;
        }

        //Validate References
        var ValidateReferences = function (lines,startIndex) {
            var result = true;
            var i = startIndex;
            var tableName = null;
            var tableKey = null;
            var refKey = null;
            do {
                var expressions = lines[i].trim().split(" ");
                if(expressions.length >= 3 && expressions[0] !== "" && expressions[1].length > 2 && expressions[2].length > 2 && expressions[1][0] === "'" && expressions[1][expressions[1].length - 1] === "'"  && expressions[2][0] === "'" && expressions[2][expressions[2].length - 1] === "'") {
                    tableName = expressions[0];
                    tableKey = expressions[1].substring(1,expressions[1].length - 1);
                    refKey = expressions[2].substring(1,expressions[2].length - 1);
                    if(ValidateReferenceName(tableName) && ValidateReferenceName(tableKey)) {
                        settings.fileReferences.push({"table":tableName, "key":tableKey, "refKey":refKey});                        
                    }
                    else {
                        result = false; 
                    }
                }
                else {
                    result = LogError("-CheckMetadata-FileReferences-RowRequiredInfo-Error",settings.fileName,i + 1);
                }
                i++;
            }
            while (lines[i].trim() !== "");
            return result;
        }

        //validate DATAFILNAVN
        var ValidateTitle = function (title) {
            var result = true;
            if(result && startNumberPattern.test(title)) {
                result = LogError("-CheckMetadata-FileLabel-TitleNumber-Error",settings.fileName,title);
            }
            if(result && !validFileNamePattern.test(title) && !enclosedReservedWordPattern.test(title)) {
                result = LogError("-CheckMetadata-FileLabel-TitleValidation-Error",settings.fileName,title);
            }
            if(result && title.length > titleMaxLength) {
                result = LogError("-CheckMetadata-FileLabel-TitleLength-Error",settings.fileName,title);
            }
            if(result && reservedWordPattern.test(title)) {
                result = LogError("-CheckMetadata-FileLabel-TitleReservedWord-Error",settings.fileName,title);
            }
            return result;
        }

        //validate basics labels ("SYSTEMNAVN","DATAFILNAVN","DATAFILBESKRIVELSE") values
        var ValidateBasicValues = function (label,lines,index) {
            var result = true;
            var table = GetTableData(settings.fileName);
            if(lines[index].trim() === "") {
                result = LogError("-CheckMetadata-FileLabel-ValueRequired-Error",settings.fileName,label);
            }
            else {
                if(label === settings.metadataLabels[0]) 
                { 
                    table.system = lines[index].trim(); 
                }
                if(label === settings.metadataLabels[1]) { 
                    if(!ValidateTitle(lines[index].trim()))  { 
                        result = false; 
                    }
                    else {
                        table.name = lines[index].trim(); 
                    } 
                }
                if(lines[index + 1].trim() !== "") {
                    result = LogError("-CheckMetadata-FileLabel-ValueMax-Error",settings.fileName,label);
                }
            }   
            return result;
        }

        // validate required labels values
        var ValidateLabelValues = function (lines) {
            var result = true;
            settings.fileKeys = [];
            settings.fileReferences = [];
            settings.metadataLabels.forEach(label => {
                var index = lines.indexOf(label);
                index += 1;
                if(label === settings.metadataLabels[0] || label === settings.metadataLabels[1] || label === settings.metadataLabels[2]) {
                    if(!ValidateBasicValues(label,lines,index)) { result = false; }
                }
                if(label === settings.metadataLabels[3] && lines[index].trim() !== "") {
                    if(!ValidateKeys(lines,index)) { result = false; }
                }
                if(label === settings.metadataLabels[4] && lines[index].trim() !== "") {
                    if(!ValidateReferences(lines,index)) { result = false; }
                }
                if(label === settings.metadataLabels[5]) {
                    if(lines[index].trim() === "") {
                        result = LogError("-CheckMetadata-FileLabel-ValueRequired-Error",settings.fileName,label);
                        settings.errorStop = true;
                    }
                    else {
                        if(!ValidateVariables(lines,index)) { result = false; }
                    }
                }
                if(label === settings.metadataLabels[6] && !settings.errorStop && !ValidateVariablesDescription(lines,index)) { result = false; }
                if(label === settings.metadataLabels[7] && lines[index].trim() !== "" && !settings.errorStop) {
                    if(!ValidateCodeList(lines,index)) { result = false; }
                }
                if(label === settings.metadataLabels[8] && lines[index].trim() !== "" && !settings.errorStop) {
                    if(!ValidateUserCodes(lines,index)) { result = false; }
                }
            });
            return result;
        }

        //Validate Metadata Labels required & orders
        var ValidateLabels = function (lines) {
            var result = true;
            var orderError = false;
            var prevIndex = -1;
            settings.metadataLabels.forEach(label => {
                var index = lines.indexOf(label);
                if(index < 0) {
                    result = LogError("-CheckMetadata-FileLabelRequired-Error",settings.fileName,label);
                }
                else {
                    if(prevIndex > index) { orderError = true; }
                    prevIndex = index;
                    index += 1;
                    if(lines.indexOf(label,index) > -1) {
                        result = LogError("-CheckMetadata-FileLabelMax-Error",settings.fileName,label);
                    }
                }
            });
            if(orderError) {
                result = LogError("-CheckMetadata-FileLabelsOrder-Error",settings.fileName);
            }
            return result;
        }

        // Validate string format type
        var ValidateStringFormat = function (variable,regExp) {
            var result = true;
            var maxLength = stringMaxLength.toString();
            var matches = variable.format.match(regExp);
            if(matches != null && matches.length > 2) {
                if(parseInt(matches[2]) <= stringMaxLength) { 
                    maxLength = matches[2];
                }
                else {
                    result = LogError("-CheckMetadata-FileVariable-DataFormat-StringLength-Error",settings.fileName,variable.name,variable.format);
                }
            }
            variable.regExps.push("^[\\w\\W\\s]{0," + maxLength + "}$");
            return result;
        }

        // Validate Int format type
        var ValidateIntFormat = function (variable,regExp) {
            var result = true;
            var length = "";
            var matches = variable.format.match(regExp);
            matches.forEach(match => {
                if(!isNaN(match)) { length = match; }
            });
            variable.regExps.push("^(\\+|\\-){0,1}[0-9]{1," + length + "}$");
            return result;
        }

        // Validate Decimal Format type
        var ValidateDecimalFormat = function (variable,regExp) {
            var result = true;
            var intLength = "";
            var decimalLength = "";
            var matches = variable.format.match(regExp);
            matches.forEach(match => {
                if(!isNaN(match)) {
                    if(intLength === "") {
                        intLength = match;
                    }
                    else {
                        decimalLength = match;
                    }
                }
            });
            variable.regExps.push("^(\\+|\\-){0,1}[0-9]{1," + intLength + "}\\.[0-9]{1," + decimalLength + "}$");
            variable.regExps.push("^(\\+|\\-){0,1}[0-9]{1," + intLength + "}\\,[0-9]{1," + decimalLength + "}$");
            return result;
        }

        //Validate Date Format type
        var ValidateDateFormat = function (variable,regExp) {
            var result = true;
            variable.regExps.push("^([0-9]{4,4})-([0-9]{2,2})-([0-9]{2,2})$");
            variable.regExps.push("^([0-9]{4,4})\\/([0-9]{2,2})\\/([0-9]{2,2})$");
            return result;
        }

        //Validate Time Format type
        var ValidateTimeFormat = function (variable,regExp) {
            var result = true;
            variable.regExps.push("^([0-9]{2,2}):([0-9]{2,2}):([0-9]{2,2})$");
            return result;
        }

        //Validate DateTime Format type
        var ValidateDateTimeFormat = function (variable,regExp) {
            var result = true;
            variable.regExps.push("^([0-9]{4,4})-([0-9]{2,2})-([0-9]{2,2})T([0-9]{2,2}):([0-9]{2,2}):([0-9]{2,2})$");
            variable.regExps.push("^([0-9]{4,4})\\/([0-9]{2,2})\\/([0-9]{2,2})T\\s([0-9]{2,2}):([0-9]{2,2}):([0-9]{2,2})$");
            variable.regExps.push("^([0-9]{2,2})-([a-zA-Z]{3,3})-([0-9]{4,4})\\s([0-9]{2,2}):([0-9]{2,2}):([0-9]{2,2})$");
            return result;
        }

        //Validate variable Format by regExp set
        /*
            var patt = new RegExp("^[\\w\\W\\s]{0,9}$");
            var res = patt.test(str);
            https://regex101.com/
        */
        var ValidateFormat = function (variableType,regExps,variable) {
            var result = false;
            for(var i = 0;i < regExps.length;i++) {
                if(regExps[i].test(variable.format)) {
                    variable.type = variableType;
                    if(variableType === "String") {
                        result = ValidateStringFormat(variable,regExps[i]);                        
                    }
                    if(variableType === "Int") {
                        result = ValidateIntFormat(variable,regExps[i]);
                    }
                    if(variableType === "Decimal") {
                        result = ValidateDecimalFormat(variable,regExps[i]);
                    }
                    if(variableType === "Date") { 
                        result = ValidateDateFormat(variable,regExps[i]); 
                    }
                    if(variableType === "Time") { 
                        result = ValidateTimeFormat(variable,regExps[i]);  
                    }
                    if(variableType === "DateTime") 
                    { 
                        result = ValidateDateTimeFormat(variable,regExps[i]); 
                    }
                    break;
                }
            }
            return result;
        }

        //Validate variables Data Formats
        var ValidateDataFormats = function () {
            var result = false;
            var table = GetTableData(settings.fileName);
            table.variables.forEach(variable => {
                var isValid = false;                
                if(!isValid) { isValid = ValidateFormat("String",datatypeString,variable); } 
                if(!isValid) { isValid = ValidateFormat("Int",datatypeInt,variable); }   
                if(!isValid) { isValid = ValidateFormat("Decimal",datatypeDecimal,variable); }
                if(!isValid) { isValid = ValidateFormat("Date",datatypeDate,variable); } 
                if(!isValid) { isValid = ValidateFormat("Time",datatypeTime,variable); }
                if(!isValid) { isValid = ValidateFormat("DateTime",datatypeDateTime,variable); }
                if(!isValid) {
                    result = LogError("-CheckMetadata-FileVariable-DataFormat-Error",settings.fileName,variable.name,variable.format);
                    settings.errorStop = true;
                }
            });
            return result;
        }

        //validate Metadata file
        var ValidateMetadata = function (metadataFilePath) {
            var result = true;
            var data = fs.readFileSync(metadataFilePath);
            if(data != null) {
                data = data.toString();
                if(data != null && data !== "") {
                    var lines = data.split("\r\n");
                    lines[0] = lines[0].trim();
                    if(!ValidateLabels(lines)) 
                    { 
                        result = false; 
                        settings.errorStop = true;
                    }
                    else {
                        if(!ValidateLabelValues(lines)) { result = false; }
                        if(!settings.errorStop && ValidateDataFormats()) { result = false; }
                    }
                }
                else {
                    result = LogError("-CheckMetadata-FileEmpty-Error",settings.fileName);
                }
            }
            else {
                result = LogError("-CheckMetadata-FileEmpty-Error",settings.fileName);
            }
            return result;
        }

        //loop Data folder's table & Metadata files
        var ValidateData = function () {
            var result = true;
            var destPath = (settings.deliveryPackagePath.indexOf("\\") > -1) ? "{0}\\{1}".format(settings.deliveryPackagePath,settings.dataPathPostfix) : "{0}/{1}".format(settings.deliveryPackagePath,settings.dataPathPostfix); 
            fs.readdirSync(destPath).forEach(folder => {
                var metadataFilePath = (destPath.indexOf("\\") > -1) ? "{0}\\{1}\\{1}.txt".format(destPath,folder) : "{0}/{1}/{1}.txt".format(destPath,folder);                 
                if(fs.existsSync(metadataFilePath)) {
                    console.log("validate metadata file: {0}".format(metadataFilePath));
                    var charsetMatch = chardet.detectFileSync(metadataFilePath);
                    var folders = metadataFilePath.getFolders();
                    settings.fileName = folders[folders.length - 1];
                    if(charsetMatch !== "UTF-8") {
                        result = LogError("-CheckMetadata-FileEncoding-Error",settings.fileName);
                    } 
                    else {
                        settings.data.push({ "fileName":settings.fileName,"errorStop":false, "system":"", "name":"", "variables":[] })
                        if(!ValidateMetadata(metadataFilePath)) { result = false; }
                        GetTableData(settings.fileName).errorStop = settings.errorStop;
                        settings.errorStop = false;
                    } 
                }
                else {
                    console.log("None exist Metadata file path: {0}".format(metadataFilePath));
                }                              
            });
            if(result) { LogInfo("-CheckMetadata-Ok",null); }
            return result; 
        }

        //start flow validation
        var Validate = function () {
            console.log(`metadata selected path: ${settings.deliveryPackagePath}`); 
            try 
            {
                var folderName = GetFolderName();
                settings.logCallback().section(settings.logType,folderName,settings.logStartSpn.innerHTML);            
                ValidateData();
                console.log("output data: ");
                console.log(settings.data);
                if(settings.errorsCounter === 0) {
                    settings.logCallback().section(settings.logType,folderName,settings.logEndNoErrorSpn.innerHTML);
                } else {
                    settings.logCallback().section(settings.logType,folderName,settings.logEndWithErrorSpn.innerHTML);
                } 
                return settings.logCallback().commit(settings.deliveryPackagePath);               
            }
            catch(err) 
            {
                HandleError(err);
            }
            return null;
        }

        var AddEvents = function (){
            console.log('events ');
        }

        //Model interfaces functions
        Rigsarkiv.Nemesis.MetaData = {        
            initialize: function (logCallback,outputErrorId,logStartId,logEndNoErrorId,logEndWithErrorId,outputPrefix) {            
                settings.logCallback = logCallback;
                settings.outputErrorSpn = document.getElementById(outputErrorId);
                settings.outputErrorText = settings.outputErrorSpn.innerHTML;
                settings.logStartSpn = document.getElementById(logStartId);
                settings.logEndNoErrorSpn = document.getElementById(logEndNoErrorId);  
                settings.logEndWithErrorSpn = document.getElementById(logEndWithErrorId);
                settings.outputPrefix = outputPrefix;
                AddEvents();
            },
            callback: function () {
                return { 
                    validate: function(path,outputText) 
                    { 
                        settings.deliveryPackagePath = path;
                        settings.outputText = outputText;
                        settings.data = [];
                        settings.errorStop = false;
                        return Validate();
                    }  
                };
            }
        };
    }(jQuery);
}(jQuery);