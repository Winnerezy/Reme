import jwt from 'jsonwebtoken'
export default function VerifyToken(req, res, next){
    try {
        const { token } = req.cookies
        if(!token){
           return res.status(401).json({message: "You are not authorized to heart this post"})
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async(err, info)=>{
            if(err) throw new Error('error found')
            req.username = info.userName 
        })
        next()
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }

}

