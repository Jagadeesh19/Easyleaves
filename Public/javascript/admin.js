const deleteEmployee=(btn)=>{
    const employeeId=btn.parentElement.querySelector("[name=employeeId]").value;
    const employeeElement=btn.closest("article");

    fetch("/admin/remove/"+employeeId,{
        method:"DELETE"
    })
        .then(result=>{
            return result.json()
        })
        .then(data=>{
            console.log(data);
            employeeElement.remove();
        })
        .catch(err=>{
            console.log(err);
        })
}
