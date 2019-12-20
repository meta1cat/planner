const { Controller } = require("../core")
const { error } = require("../define")

module.exports = class Current extends Controller
{
    constructor(ctx, app)
    {
        super(ctx, app)
    }

    list()
    {
        const { ctx, service } = this

        const planner = ctx.planner
        const current = service.milestone

        const ret = []

        const milestone_planner = current.get_planner(planner._id)

        if (milestone_planner == null)        
        {
            ctx.body = ret
            return
        }

        for (let one of milestone_planner.curr.data)
        {
            let data = { ...one }

            if (one.assignee)
            {
                let assignee = service.user.get(one.assignee)
                data.assignee = {
                    _id: assignee._id,
                    name: assignee.name,
                }
            }

            if (one.milestone)
            {
                let milestone = service.milestone.get(one.milestone)
                data.assignee = {
                    _id: milestone._id,
                    name: milestone.title,
                }
            }

            ret.push(data)
        }

        ctx.body = ret
    }

    create()
    {
        const { ctx, service } = this
        const { user, planner } = ctx

        const milestone = service.milestone

        const body = ctx.request.body

        body.title = (body.title || "").trim()

        if (body.title.length == 0)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "title is invalid"
            }
            return
        }

        body.author = user._id
        body.planner = planner._id

        milestone.create(body)

        ctx.body = {}
    }

    update()
    {
        const { ctx, service } = this
        const { user, planner } = ctx

        const milestone = service.milestone

        const stone = ctx.params.milestone
        const body = ctx.request.body

        if (stone == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "milestone id required"
            }
            return
        }

        let item = milestone.get(stone)
        if (item == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "milestone is not exist"
            }
            return
        }

        milestone.update(item, body)

        ctx.body = {}
    }

    destroy()
    {
        const { ctx, service } = this

        const milestone = service.milestone

        const stone = ctx.params.milestone

        if (stone == null)
        {
            ctx.status = error.BAD_REQUEST
            ctx.body = {
                error: "milestone id required"
            }
            return
        }

        milestone.destroy(stone)

        ctx.body = {}

    }
}