module.exports=(req,res,next)=>{
    if (!req.session.isLoggedIn){
        res.redirect("/login");
    }
    else if(req.session.userType=="admin"){
        res.status(404).render("404",{
            pageTitle:"Page not found",
            path:""
        })
    }
    next();
}