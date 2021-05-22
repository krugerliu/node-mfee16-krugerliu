console.log("hello, this is roger's web site!");

myFunction(5);
myFunction(100);
myFunction(1000);

function myFunction(p1) {
    let j=0;
    for (let i = 1; i <= p1; i++) {
        j=j+i;
    };
    console.log(j);
};

