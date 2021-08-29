module.exports = function(RED) {
    function ValidateXML(config) {
        const Libxml = require('node-libxml');
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let libxml = new Libxml();
            libxml.loadSchemas(['C:/users/cam/.node-red/pet.xsd']);
            msgs = [];
            let xmlIsWellformed = libxml.loadXmlFromString(msg.payload);
            if (xmlIsWellformed) {
                let schemaLoadedError = !!libxml.schemasLoadedErrors;
                let xmlIsValid = libxml.validateAgainstSchemas(msg.payload);
                if (schemaLoadedError)
                {
                    msgs.push(null)
                    msg.errorLocation = "Schema loading";
                    msgs.push(msg);
                    msgs.push({ _msgid: msg._msgid, payload: libxml.schemasLoadedErrors });    
                } else if (xmlIsValid) {
                    msgs.push(msg);
                    msgs.push(null);
                    msgs.push(null);    
                } else {
                    msgs.push(null)
                    msg.errorLocation = "Schema validation";
                    msgs.push(msg);
                    msgs.push({ _msgid: msg._msgid, payload: libxml.validationSchemaErrors[Object.keys(libxml.validationSchemaErrors)[0]] });    
                }
            } else {
                msgs.push(null)
                msg.errorLocation = "Well formed validation";
                msgs.push(msg);
                msgs.push({ _msgid: msg._msgid, payload: libxml.wellformedErrors });
            }

            node.send(msgs);
        });
    }
    RED.nodes.registerType("libxml-xsd",ValidateXML);
}