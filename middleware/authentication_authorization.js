const jwt = require('jsonwebtoken');
var secretKey = "@dsf$sdsaxcxzxc213";

async function authorization(req,res,next) {
    try {
        if (!req.params["id"]){
            const id = req.params["id"]
            suburl = req.originalUrl.replace(id, ":id");
            payload = req["payload"]
        }
        return next()
    } catch (err) {
        next(err)
    }
}

async function authentication(req,res,next) {
    try{
        token = req.get("Authorization")
        if (!token) {
            res.status(401).send({"error":
                {
                    "name": "Authorization token",
                    "message": "token is nill"
                }
            })
        }
        const payload = jwt.verify(token, secretKey);
        req["payload"] = payload
            return next()
    } catch (err) {
        res.status(401).send({"error":err})
    }
}

async function generateToken(user) {
    const payload = { id: user._id, username: user.username,roleId: user.roleId };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    var newDateObj = new Date();
    Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() +
                (h * 60 * 60 * 1000));
    return this;
    }
    const expireAt = newDateObj.addHours(1)
    expireAt.toTimeString()
    return {token,expireAt}
}

module.exports = { authentication , authorization , generateToken}