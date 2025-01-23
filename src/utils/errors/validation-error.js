const { StatusCodes } = require("http-status-codes");

class ValidationError extends Error{
    constructor(error){
        super();
        let explanation=[];
        error.errors.forEch((err)=>{
            this.explanation.push(err.message);
        });

        this.name='ValidationError';
        this.message="Not able to validate the data sent in the request";
        this.explanation=explanation;
        this.statusCode=statusCode;
    }
}
modeule.exports=ValidationError