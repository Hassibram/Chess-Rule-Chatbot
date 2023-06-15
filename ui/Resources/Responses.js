// Declarations
const fs =require("fs");
const readline = require("readline");
let raw_data = fs.readFileSync('ui/Resources/Pieces.json');
let pieces = JSON.parse(raw_data);
let opening_data = fs.readFileSync("ui/Resources/openings.json");
let openings = JSON.parse(opening_data);
let Question_data = fs.readFileSync('ui/Resources/Questions.json');
let questions = JSON.parse(Question_data);
let more = 0;
let ans_buffer = []

async function answer(keywords){
    ans_buffer = [];
    more = 0;
    if (keywords["piece"].length === 1) {
        let t = keywords["piece"][0].charAt(0).toUpperCase() + keywords["piece"][0].slice(1); //Change piece name to upper case for navigate json
        if (keywords["piece operator"].includes("move")) {
            return "The " + t + " " + pieces["White"][t]["steps"] + "and " + pieces["White"][t]["direction"];
        } else if (keywords["piece operator"].includes("special")){
            return "The " + t + pieces["White"][t]["Special_Move"] + pieces["White"][t]["extended"];
        }else if (keywords["piece operator"].includes("direction")){
            return "The " + t + pieces["White"][t]["direction"];
        } else if(["steps"].some(val => keywords["piece operator"].includes(val))){
            return "The " + t + pieces["White"][t]["steps"];
        } else if(["position", "placed", "place", "start", "put"].some(val => keywords["piece operator"].includes(val))){
            return "The " + t + "'s starting position is " + pieces["White"][t]["Current_Position"] +" for white";
        } else if(["worth", "value"].some(val => keywords["piece operator"].includes(val))) {
            return "The " + t + pieces["White"][t]["points"];
        } else if(["capture", "take"].some(val => keywords["piece operator"].includes(val))) {
            return "The " + t + pieces["White"][t]["capturing"];
        }
    } if (keywords["rule_book"].length >= 1){
        ans_buffer = await searchFile([keywords["piece"], keywords["piece operator"],keywords["rule_book"]].flat());
        return ans_buffer[more]
    }

}//First checks if keywords match Pieces.json and if not the searches Rule.txt
function bot_answer(question){
    //     " Let us start from the beginning, do you want me to show you how to set up the board? ",
    //     " How about the pieces now, do you want to learn about How those move? ",
    //     " Did you know some pieces have special abilities? I can tell you all about them? ",
    //     " Would you like some hints regarding the pieces? ",
    //     " would you like to know some common openings and their names"
    //     " "
    let ans = []
    ans[0] = "";
    let ans_start = questions["positive_answer"][any_element(questions["positive_answer"].length)]
    if (question === "A1"){

        ans_start = ans_start + ". I'll do the white pieces and lets see if you can do the black pieces." +
            "+ \n The " + i + " starts at position: "
        for (let i in pieces.White) {
            for (let j in pieces.White[i].Current_Position) {
                ans.push(" " +pieces.White[i].Current_Position[j]);
            }
        }
    } else if (question === "A2"){
        for (let i in pieces.White) {
            //ans = ans + i + "starts at position: ";
            for (let j in pieces.White[i]) {
                ans.push(pieces.White[i].steps +" " + pieces.White[i].direction);
            }
        }
    } else if (question === "A3"){
        ans_start = ans_start + " Ah, you want the special moves, you are going to have to pick the one you like the most. \n";
        for (let i in pieces.White) {
            if (pieces.White[i].Special_Move !== "") {
                ans.push(" " + "The " + i + " is: it " +  pieces.White[i].Special_Move + "  \n");
            }
        }
    } else if (question === "A4"){
        ans_start = ans_start + " I'll start with the king ";
        for (let i in pieces.White) {
            if (pieces.White[i].extended !== "") {
                ans.push(pieces.White[i].extended);
            }
        }
    } else if (question === "A5"){
        for (let i =0; i < 30; i++){
            ans.push(openings["opening"][any_element(openings["opening"].length)]);
        }
    }
    ans[0] = ans_start;
    ans_buffer = [];
    ans_buffer = ans;
    more = 0;
    return ans
} //bot answers to predetermined questions, needs to be expanded
function next_ans(){
    more++;
    if (more === ans_buffer.length - 1){
        return "This is the last one I'm afraid: " + ans_buffer[more];
    }else if( more < ans_buffer.length - 1){
        return ans_buffer[more];
    }
    else return "";
} //Iterates through the answers already found.
async function searchFile(keywords, file="ui/Resources/Rule.txt") {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let found = [];
    let res = 0;
    let keep = false;
    for await (const line of rl) {
        if (keep) {
            found[res].push(line.slice(0, -1));
            if (line[line.length - 1] === "."){
                res++;
                keep = false;
            }
        }
        if (!keep) {
            for (let keyword of keywords) {
                if (line.includes(keyword)) {
                    found[res] = [];
                    if (line[line.length - 1] === "-") {
                        keep = true;
                        found[res].push(line.slice(0, -1))
                        break;
                    }
                }
            }
        }

    }
    let max = 0;
    let ans = "";
    for (i of found){
        let val = score(keywords, i)
        if (max < val){
            ans = i;
            max = val;
        }
    }
    return ans
} //search for keywords in Rule.txt. is line by line search
function any_element(arr_len){
    return Math.floor(Math.random() * arr_len);
} //return random element in an array

function score(keyword, from_file){

    let val = 0;
    let max = 0;
    for (let j of from_file){
        let s = j.split(" ");
        val = 0;
        let half = Math.floor(s.length/2);
        for (let i of keyword){
            let pos = s.indexOf(i)
            if(pos >= 0) {
                if (pos <= half){
                    val++;
                }
                val++;
            }
        }
        if (val>max){
            max = val;
        }
    }
    return max
} //ranks the results of the search based on how early keywords is found: earlier is better

function grammar_handler(keywords, words){//"can", "is", "does", "will", "should", "could", "would", "how", "why", "when", "what", "which", "will", "mean"
    if(["when", "can", "could", "would"].some(val => words.includes(val))){
        keywords["rule_book"].push("the");
        keywords["rule_book"].push("a");
        keywords["rule_book"].push("when")
        keywords["rule_book"].push("can");
        keywords["size"] += 4;
    }
    if(["what", "does", "is"].some(val => words.includes(val))){
        keywords["rule_book"].push("the");
        keywords["rule_book"].push("is")
        keywords["rule_book"].push("are");
        keywords["rule_book"].push("a");
        keywords["size"] += 5;
    }
    return keywords;
} //depending on connectors, adds more value to the, to be optimised "score(keyword, from_file)"

module.exports = {answer, bot_answer, next_ans};
