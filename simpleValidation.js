(function (window,document,undefined) {
    "use strict";
    var defaultsMessages = {
        required: "%s不能为空",
        valid_email: "不是正确的邮箱",
        min_length: "%s的长度不能小于%n",
        max_length: "%s的长度不能大于%n",
        alpha: "%s只能包含英文",
        alpha_numeric: "%s只能包含英文和数字",
        alpha_dash: "%s只能包含英文、数字、_、-",
        numeric: "%s只能包含数学",
        noIdeograph : "%s 不能包含中文"
    };
    var defaultCallback = function (result) {
        console.log("default callback.");
    };
    var defaultRegex = {
        numericRegex : /^[0-9]+$/,
        emailRegex : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        alphaRegex : /^[a-z]+$/i,
        alphaNumericRegex : /^[a-z0-9]+$/i,
        alphaDashRegex : /^[a-z0-9.@_\-]+$/i,
        noIdeographRegex : /[\u4E00-\u9FFF]+/g,
    };
    /**
     * 获取指定元素的属性
     * @param element
     * @param attributeName
     * @returns {*}
     */
    var attributeValue =function (element, attributeName) {
        var i,elementLength = element.length;
        if ((element.length > 0) && (element[0].type === "radio" || element[0].type === "checkbox")) {
            for (i = 0; i < elementLength; i++) {
                if (element[i].checked) {
                    return element[i][attributeName];
                }
            }
            return;
        }
        return element[0][attributeName];
    };
    /**
     * 根据name将一个element转换为自定义的结构
     * @param name
     * @returns {{}}
     */
    var element2Field =function (name) {
        var element = document.getElementsByName(name);
        var field = {};
        field.value = attributeValue(element,"value");
        field.type = attributeValue(element,"type");
        return field;
    };
    /**
    *构造函数
    /**
    var simpleValidation =function (messages,hooks) {
        this._initial(messages,hooks);
    };
    
    simpleValidation.prototype = {
        constructor : this,
        _initial : function (messages,hooks) {
            this._messages = Object.assign(defaultsMessages,messages);
            this._regex = defaultRegex;
            this._hooks = Object.assign(this._hooks,hooks);
        },
        _validate : function (name,display,rules,callback,min,max) {
            var _callback = callback || defaultCallback;
            var _field = element2Field(name);
            var _rules = [];
            if(rules && typeof rules === "string"){
                _rules = rules.split("|");
            }else{
                _rules.push("required");
                console.log("Rule is not found,setting 'required' as default rule.")
            }
            var i;
            var result = {};
            var resultFlag = false;
            var resultMsg = "";
            for(i = 0;i < _rules.length;i++){
                if(this._hooks.hasOwnProperty(_rules[i])){
                    if(min && this._regex.numericRegex.test(min)){
                        resultFlag = this._hooks[_rules[i]].call(this,_field,min);
                    }else if(max && this._regex.numericRegex.test(max)){
                        resultFlag = this._hooks[_rules[i]].call(this,_field,max);
                    }else{
                        resultFlag = this._hooks[_rules[i]].call(this,_field);
                    }
                    if(resultFlag == false){
                        break;
                    }
                }
            }
            if(resultFlag == false){
                if(this._messages.hasOwnProperty(_rules[i])){
                    resultMsg = this._messages[_rules[i]];
                }
            }
            resultMsg = resultMsg != ""? resultMsg.replace("%s",display) : "No message has set.";
            if(this._regex.numericRegex.test(min)){
                resultMsg = resultMsg.replace("%n",min);
            }
            if(this._regex.numericRegex.test(max)){
                resultMsg = resultMsg.replace("%n",max);
            }
            result.resultFlag = resultFlag;
            result.resutlMsg = resultMsg;
            if(_callback && typeof _callback === "function"){
                _callback(result);
            }else{
                console.log(result.resultFlag + "|" + result.resutlMsg);
                console.log("Validation is finished,but no callback.")
            }
        },
        _hooks : {
            required: function(field) {
                var value = field.value;
                if ((field.type === 'checkbox') || (field.type === 'radio')) {
                    return (field.checked === true);
                }
                return (value !== null && value !== '' && value !== undefined);
            },
            valid_email : function (field) {
                return (this._regex.emailRegex.test(field.value));
            },
            min_length : function (field,length) {
                if(!this._regex.numericRegex.test(length)){
                    return false;
                }
                return (field.value.length >= parseInt(length,10));
            },
            max_length: function(field, length) {
                if (!this._regex.numericRegex.test(length)) {
                    return false;
                }
                return (field.value.length <= parseInt(length, 10));
            },
            noIdeograph : function (field) {
                return (!this._regex.noIdeographRegex.test(field.value));
            },
            alpha_numeric : function (field) {
                return (this._regex.alphaNumericRegex.test(field.value));
            },
            alpha_dash : function (field) {
                return (this._regex.alphaDashRegex.test(field.value));
            },
            numeric : function (field) {
                return (this._regex.numericRegex.test(field.value));
            }
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = simpleValidation;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return simpleValidation;});
    } else {
        !('simpleValidation' in window) && (window.simpleValidation = simpleValidation);
    }

}(window,document));
