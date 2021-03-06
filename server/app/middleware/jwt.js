const jwt = require('jsonwebtoken')

let cookie_options = { httpOnly: false, maxAge: 1000 * 3600 * 24 * 30 }

module.exports = (option, app) =>
{
    let sign = (payload) =>
    {
        return jwt.sign(payload, option.secret, option.options)
    }

    let verify = (token) =>
    {
        return jwt.verify(token, option.secret, option.options)
    }

    return async function(ctx, next)
    {
        let token = ctx.cookies.get("token")
        if (token == null)
        {
            let resp = await next()

            if (ctx.session)
            {
                token = sign(ctx.session)
                ctx.cookies.set("token", token, cookie_options)

                console.log("set token", token)
            }

            return resp
        }

        ctx.session = verify(token)

        let resp = await next()

        if (ctx.session == null)
        {
            ctx.cookies.set('token')
        }

        return resp
    }
}
