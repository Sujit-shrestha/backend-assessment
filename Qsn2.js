const target = 11;
let nums = [5,2,6,8,1,9];

let m= new Map()
let outputNF = "Pair not found";
 let outputF =null;
for (let i=0 ; i<nums.length ;i++ ){
  let p=target-nums[i];
  if( m.has(p)){
   outputF = "[" + nums[m.get(p)] + "," + nums[i] + "]";
    console.log(outputF)
  }else{
    m.set(nums[i],i );
  }  
}
if(outputF == null){
  console.log(outputNF)
}
