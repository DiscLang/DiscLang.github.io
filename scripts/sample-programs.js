(function () {

    const montyPython = `begin
    # call can be used instead of the colon notation
    let questions be (call newArray)
    let answers be (call newDictionary)

    # add questions to the questions array
    appendTo: questions (newArray: "name" "What is your name?")
    appendTo: questions (newArray: "quest" "What is your quest?")
    appendTo: questions (newArray: "color" "What is your favorite color?")

    # Array indices start at 1
    let count be 1

    repeat while count isLessOrEqualTo (lengthOf: questions)
        let question be readFrom: questions count
        let questionKey be readFrom: question 1
        let response be prompt: readFrom: question 2
        
        setOn: answers questionKey response

        update count to count + 1
    end

    let badName be (readFrom: answers "name") isEqualTo ""
    let acceptableQuest be "I seek the holy grail"
    let badQuest be not: ((toLowerCase: quest) isEqualTo (toLowerCase: acceptableQuest))
    let badColor be (readFrom: answers "color") isEqualTo ""

    if badName or badQuest or badColor
        print: "... and that's how you ended up in the pit."
    else
        print: join: "Congrats " (readFrom: answers "name") "!"
        print: join: "You managed to escape the pit on your quest."
        print: join: "Here's a shirt for you. The text is " (readFrom: answers "color") " just like you like it."
    end

end`;

    const rockPaperScissors = `begin
	define ROCK as "rock"
	define PAPER as "paper"
	define SCISSORS as "scissors"

	let options be newArray: ROCK PAPER SCISSORS
	let playAgain be true

	let wins be 0
	let losses be 0
	let ties be 0

	repeat while playAgain
		call clear

		print: join: "wins: " wins " losses: " losses " ties: " ties

		let computerChoice be readFrom: options (random: 1 4)
		let userChoice be ""

		repeat while not: ((userChoice isEqualTo ROCK) or (userChoice isEqualTo PAPER) or (userChoice isEqualTo SCISSORS))
			update userChoice to toLowerCase: (prompt: "Rock, paper, or scissors? ")
		end

		print: join: "The computer chose: " computerChoice
		print: join: "You chose: " userChoice

		let rockWin be (userChoice isEqualTo ROCK) and (computerChoice isEqualTo SCISSORS)
		let paperWin be (userChoice isEqualTo PAPER) and (computerChoice isEqualTo ROCK)
		let scissorsWin be (userChoice isEqualTo SCISSORS) and (computerChoice isEqualTo PAPER)

		if rockWin or paperWin or scissorsWin
			update wins to wins + 1
			print: "You won!"
		else if userChoice isEqualTo computerChoice
			update ties to ties + 1
			print: "Tie game."
		else
			update losses to losses + 1
			print: "Better luck next time."
		end

		let rematch be ""

		repeat while (not: (rematch isEqualTo "y")) and (not: (rematch isEqualTo "n"))
			update rematch to toLowerCase: (prompt: "Rematch? (y/n)")
		end

		update playAgain to rematch isEqualTo "y"
	end

	call clear
	print: join: "wins: " wins " losses: " losses " ties: " ties

end`;

    const coinToss = `begin
	define sides as newArray: "Heads" "Tails"

	let tossResult be readFrom: sides random: 1 3
		
	print: tossResult
end`;

    const helloWorld = `begin
	print: "Hello, World!"
end`;

    return {
        "Hello World": helloWorld,
        "Coin Toss": coinToss,
        "Rock, Paper, Scissors": rockPaperScissors,
        "Monty Python": montyPython
    }
})();

