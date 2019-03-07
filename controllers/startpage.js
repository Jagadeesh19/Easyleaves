module.exports=(req,res,next)=>{
    res.render("index",{
        pageTitle:"welcome to the portal",
        path:"/"
    });
};