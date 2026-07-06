
const personalities=[
"Chaos Goblin",
"Wise Monk",
"Savage Roaster",
"Meme Brain",
"Calm Therapist"
];

const responses={
"Chaos Goblin":[
"Wild energy detected. Have you considered screaming into the void?",
"Your rage level could power three cities."
],
"Wise Monk":[
"Anger often hides a wounded expectation.",
"You suffered twice: once in reality and once in your mind."
],
"Savage Roaster":[
"If rage burned calories, you'd be a superhero.",
"That problem woke up and chose you specifically."
],
"Meme Brain":[
"Current status: emotional damage.exe",
"Loading dramatic soundtrack..."
],
"Calm Therapist":[
"I hear frustration. What hurt underneath it?",
"You sound exhausted more than angry."
]
};

function sendRage(){
let text=document.getElementById("msg").value;
if(text.trim()===""){
alert("Write something first");
return;
}

document.getElementById("loading").innerHTML="Matching anonymous responder...";

setTimeout(()=>{
let p=personalities[Math.floor(Math.random()*personalities.length)];

document.getElementById("loading").innerHTML=`Incoming responder: ${p}`;

setTimeout(()=>{
let r=responses[p][Math.floor(Math.random()*responses[p].length)];

document.getElementById("response").innerHTML=`
<h3>Anonymous Reply</h3>
<p>${r}</p>
<hr>
<p>Thread Closed 🔒</p>
`;
},2000)

},2000)
}
