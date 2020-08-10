const samplePrograms = (function () {

    const gameOfLife = `begin
	define LIVE_CELL as "#"
	define DEAD_CELL as "."

	declare function isLiveCell ...
		withParameters currentState xCoord yCoord

		let currentCell be readFrom: (readFrom: currentState xCoord) yCoord
		
		if (isNil: currentCell)
			false
		else
			currentCell isEqualTo LIVE_CELL
		end

	end

	declare function between withParameters value min max
		(value isGreaterThan min) and (value isLessThan max)
	end

	declare function getCellLifeValue ...
		withParameters currentState xCoord yCoord
        
        if isLiveCell: currentState xCoord yCoord
        	1
        else
        	0
        end
	end

	declare function getLivingNeighborCount ...
		withParameters currentState xCoord yCoord
		let line be 1
		let livingCount be 0
		let surroundingCoordCount be 8

        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord - 1) (yCoord - 1))
        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord - 1) (yCoord))
        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord - 1) (yCoord + 1))
        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord) (yCoord - 1))
        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord) (yCoord + 1))
        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord + 1) (yCoord - 1))
        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord + 1) (yCoord))
        update livingCount to livingCount + (getCellLifeValue: currentState (xCoord + 1) (yCoord + 1))
	end

	declare function getNextStep ...
		withParameters currentState xCoord yCoord
		
		let currentCell be readFrom: (readFrom: currentState xCoord) yCoord
		let currentCellIsLiving be currentCell isEqualTo LIVE_CELL

		let livingNeighbors be getLivingNeighborCount: currentState xCoord yCoord

		let isLivingAndStable be currentCellIsLiving and (:: livingNeighbors between 1 4)
		let isReproducing be (not: currentCellIsLiving) and (livingNeighbors isEqualTo 3)

		if isLivingAndStable or isReproducing
			LIVE_CELL
		else
			DEAD_CELL
		end
	end

	declare function getNewBoard
		let width be 15
		let height be 15
		let board be (newArray:)

		let currentRowIndex be 1
		
		repeat while currentRowIndex isLessOrEqualTo height
			let currentCellIndex be 1
			let currentRow be (newArray:)

			repeat while currentCellIndex isLessOrEqualTo width
				let randomSelection be floor: random: 0 2

				if randomSelection isEqualTo 0
					appendTo: currentRow DEAD_CELL
				else
					appendTo: currentRow LIVE_CELL
				end

				update currentCellIndex to currentCellIndex + 1
			end

			update currentRowIndex to currentRowIndex + 1
			appendTo: board currentRow
		end
	end

	declare function printBoard withParameters board
		let rowIndex be 1
		let boardHeight be (lengthOf: board)

		repeat while rowIndex isLessOrEqualTo boardHeight
			let currentRow be readFrom: board rowIndex
			let rowLength be lengthOf: currentRow
			let cellIndex be 1
			let rowDisplay be ""

			repeat while cellIndex isLessOrEqualTo rowLength
				update rowDisplay to join: rowDisplay (readFrom: currentRow cellIndex) " "
				update cellIndex to cellIndex + 1
			end

			print: rowDisplay
			update rowIndex to rowIndex + 1
		end
	end

	declare function getNextBoard withParameters currentBoard
		let boardHeight be lengthOf: currentBoard
        let boardWidth be lengthOf: readFrom: currentBoard 1
		let rowIndex be 1
		let newBoard be (newArray:)

		repeat while rowIndex isLessOrEqualTo boardHeight
			let cellIndex be 1
			let newRow be (newArray:)

			repeat while cellIndex isLessOrEqualTo boardWidth
				let newCell be getNextStep: currentBoard rowIndex cellIndex
				
				appendTo: newRow newCell
				update cellIndex to cellIndex + 1
			end

			update rowIndex to rowIndex + 1
        
			appendTo: newBoard newRow
		end

	end

	let currentBoard be call getNewBoard

    let counter be 1
    let terminationCount be 150
        
	repeat while counter isLessThan terminationCount
		call clearScreen

        if (counter isLessThan (terminationCount - 1))
        	print: join: "Running. " (terminationCount - counter)
        else
        	print: "Done."
        end
        
		printBoard: currentBoard

		update currentBoard to getNextBoard: currentBoard
		update counter to counter + 1
		wait: 0.03125
	end

end`

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
	let quest be readFrom: answers "quest"
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

    declare function displayScore
        call clearScreen

		print: "Rock, Paper, Scissors"
		print: "---------------------"
        print: join: "wins: " wins " losses: " losses " ties: " ties
    end

    declare function didUserWin withParameters userChoice computerChoice
        let rockWin be (userChoice isEqualTo ROCK) and (computerChoice isEqualTo SCISSORS)
        let paperWin be (userChoice isEqualTo PAPER) and (computerChoice isEqualTo ROCK)
        let scissorsWin be (userChoice isEqualTo SCISSORS) and (computerChoice isEqualTo PAPER)

        (rockWin or paperWin or scissorsWin)
    end

    declare function wasGameATie withParameters userChoice computerChoice
        (userChoice isEqualTo computerChoice)
    end

    declare function getUserChoice
        let userChoice be ""

        repeat while not: ((userChoice isEqualTo ROCK) or (userChoice isEqualTo PAPER) or (userChoice isEqualTo SCISSORS))
            update userChoice to toLowerCase: (prompt: "Rock, paper, or scissors? ")
        end
    end

    declare function haveRematch withParameters gameMessage
        let rematch be ""

        repeat while (not: (rematch isEqualTo "y")) and (not: (rematch isEqualTo "n"))
            update rematch to toLowerCase: (prompt: join: gameMessage " Rematch? (y/n)")
        end

        (rematch isEqualTo "y")
    end

    declare function updateScoreAndGetMessage withParameters userChoice computerChoice
        if (didUserWin: userChoice computerChoice)
            update wins to wins + 1
            "You won!"
        else if (wasGameATie: userChoice computerChoice)
            update ties to ties + 1
            "Tie game."
        else
            update losses to losses + 1
            "You lost, better luck next time."
        end
    end

    repeat while playAgain
        call displayScore

        let computerChoice be readFrom: options (random: 1 4)
        let userChoice be (call getUserChoice)

        print: join: "The computer chose: " computerChoice
        print: join: "You chose: " userChoice

        let message be updateScoreAndGetMessage: userChoice computerChoice

        print: message

        update playAgain to haveRematch: message
    end

    call displayScore

end`;

	const coinToss = `begin
	define sides as newArray: "Heads" "Tails"

	let tossResult be readFrom: sides random: 1 3
	
	print: "Coin Toss"
	print: "---------"
	print: tossResult
end`;

	const helloWorld = `begin
	print: "Hello, World!"
end`;

	return {
		"Hello World": helloWorld,
		"Coin Toss": coinToss,
		"Monty Python": montyPython,
        "Rock, Paper, Scissors": rockPaperScissors,
        "Game of Life": gameOfLife
	}
})();

