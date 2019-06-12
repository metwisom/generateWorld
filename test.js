





function a(){
    console.time('e');
    let array = [];
    for (let i = 0; i < 99999;i++) {
        array[i] = Math.random();
    }
    console.timeEnd('e');
}

function b() {
    console.time('e');
    let array = [];
    for (let i = 0; i < 99999; i++) {
        array.push(Math.random());
    }
    console.timeEnd('e');


}


for (let i = 1000; i--;)
b();