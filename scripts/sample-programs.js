const samplePrograms = (function () {

	const rule110 = `begin
	define CELL_0 as " "
	define CELL_1 as "#"

	declare function getRandomCell
		let cellOptions be newArray: CELL_0 CELL_1
		let selectedCellValue be floor: random: 1 3

		readFrom: cellOptions selectedCellValue
	end

	declare function createTopRow
		let topRow be (newArray:)
		let currentIndex be 1

		repeat while currentIndex isLessOrEqualTo 50
			update currentIndex to currentIndex + 1

			appendTo: topRow call getRandomCell
		end
	end

	declare function getCheckValue withParameters previousRow checkIndex
        if checkIndex isLessThan 1
    	    CELL_0
		else if checkIndex isGreaterThan lengthOf: previousRow
			CELL_0
        else
        	readFrom: previousRow checkIndex
        end
	end

	declare function computeNewValue withParameters checkArray
		let comparisonValue be join: ...
			(readFrom: checkArray 1) ...
			(readFrom: checkArray 2) ...
			(readFrom: checkArray 3)

		if comparisonValue isEqualTo (join: CELL_1 CELL_1 CELL_1)
			CELL_0
		else if comparisonValue isEqualTo (join: CELL_1 CELL_0 CELL_0)
			CELL_0
		else if comparisonValue isEqualTo (join: CELL_0 CELL_0 CELL_0)
			CELL_0
		else
			CELL_1
		end
	end

	declare function getNewValue withParameters previousRow currentIndex
		let checkIndices be newArray: ...
			(currentIndex - 1) ...
			currentIndex ...
			(currentIndex + 1)

		let checkArray be (newArray:)
		
		let index be 1

		repeat while index isLessOrEqualTo 3
			let currentCheckIndex be readFrom: checkIndices index

			update index to index + 1

			appendTo: checkArray getCheckValue: previousRow currentCheckIndex
		end

		computeNewValue: checkArray
	end

	declare function getNextRow withParameters previousRow
		let newRow be (newArray:)
		let currentIndex be 1

		repeat while currentIndex isLessOrEqualTo lengthOf: previousRow
			let newValue be getNewValue: previousRow currentIndex

			update currentIndex to currentIndex + 1

			appendTo: newRow newValue
		end
	end

	declare function printRow withParameters rowArray
		let currentIndex be 1
		let finalString be ""

		repeat while currentIndex isLessOrEqualTo lengthOf: rowArray
			update finalString to join: finalString (readFrom: rowArray currentIndex)

			update currentIndex to currentIndex + 1
		end

		print: finalString
	end

	declare function displayRule110
		call clearScreen

		let nextRow be call createTopRow
		let count be 1

		repeat while count isLessThan 150
			printRow: nextRow

			wait: 0.0625
			update nextRow to getNextRow: nextRow

			update count to count + 1
		end
	end

	declare function rule110Splash withParameters countdown
		call clearScreen

		print: "************"
		print: "* Rule 110 *"
		print: "************"

		print: ""

		print: "Rule 110, like Conway's Game of Life, is a cellular"
		print: "automaton. The first row of this pattern is randomized,"
		print: "and each row below it is computed from the row above. "
		print: "These are both demonstrations of generative visualizations"
		print: "produced by a program following simple rules."

		print: ""

		if countdown isGreaterThan 0
			print: join: "Starting in: " countdown

			wait: 1
			rule110Splash: (countdown - 1)
		else
			call displayRule110
		end
	end
	
	rule110Splash: 10

end`;

	const toDoList = `begin
	# To Do List

	let tasks be (newArray:)

	declare function addATask
		let newTask be prompt: "What do you want to do?"
		appendTo: tasks newTask

		call startToDoList
	end

	declare function completeATask
		let taskId be prompt: "Which task is done? (enter number)"

		removeFrom: tasks (stringToNumber: taskId)

		call startToDoList
	end

	declare function exit
		call clearScreen

		print: "**********************"
		print: "* See you next time! *"
		print: "**********************"

		wait: 2

		call clearScreen
	end

	let mainMenu be (newDictionary:)
	setOn: mainMenu "1" (newDictionary:)
	setOn: mainMenu "2" (newDictionary:)
	setOn: mainMenu "3" (newDictionary:)

	setOn: (readFrom: mainMenu "1") "text" "Add a task"
	setOn: (readFrom: mainMenu "2") "text" "Complete a task"
	setOn: (readFrom: mainMenu "3") "text" "Exit"

	setOn: (readFrom: mainMenu "1") "action" addATask
	setOn: (readFrom: mainMenu "2") "action" completeATask
	setOn: (readFrom: mainMenu "3") "action" exit

	declare function getKeyOptions withParameters options
		let keyText be ""
		let keys be getKeysFrom: options
		let currentIndex be 1

		repeat while currentIndex isLessOrEqualTo (lengthOf: keys)
			let currentKey be readFrom: keys currentIndex

			if keyText isEqualTo ""
				update keyText to currentKey
			else if currentIndex isEqualTo (lengthOf: keys)
				update keyText to join: keyText ", or " currentKey
			else
				update keyText to join: keyText ", " currentKey
			end

			update currentIndex to currentIndex + 1
		end

		(keyText)
	end

	declare function showMainMenu
		let keys be getKeysFrom: mainMenu
		let currentIndex be 1

		repeat while (currentIndex isLessOrEqualTo (lengthOf: keys))
			let currentKey be readFrom: keys currentIndex
			print: join: currentIndex " - " ...
				readFrom: (readFrom: mainMenu currentKey) "text"
			update currentIndex to currentIndex + 1
		end

		print: ""
		print: "Press 1, 2, or 3 to continue:"
	end

	declare function showToDoList
		let currentIndex be 1

		repeat while currentIndex isLessOrEqualTo lengthOf: tasks
			print: join: currentIndex ") " readFrom: tasks currentIndex
			update currentIndex to currentIndex + 1
		end
	end

	declare function getMenuSelection
		let selectedOption be ""
		
		repeat while not: hasKey: mainMenu selectedOption
			update selectedOption to (readKey:)
		end
	end

	declare function startToDoList
		call clearScreen

		print: "The Grand To Do List"
		print: "--------------------"
		print: ""
		
		if (lengthOf: tasks) isGreaterThan 0
			call showToDoList
			print: ""
		end

		print: "----- menu -----"
		call showMainMenu

		let menuSelection be (call getMenuSelection)
		let menuOption be readFrom: mainMenu menuSelection
		let action be readFrom: menuOption "action"

		call action
	end

	declare function runToDoList
		call clearScreen

		print: "************************"
		print: "* The Grand To Do List *"
		print: "************************"

		wait: 5

		call startToDoList
	end

	call runToDoList
end`;

    const gameOfLife = `begin
	define LIVE_CELL as "#"
	define DEAD_CELL as "."

	declare function isLiveCell ...
		withParameters currentState xCoord yCoord

		let currentRow be readFrom: currentState xCoord
		let currentCell be readFrom: currentRow yCoord
		
		if (isNil: currentCell)
			false
		else
			currentCell isEqualTo LIVE_CELL
		end

	end

	declare function isBetween withParameters value min max
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
		let currentCellIsDead be currentCell isEqualTo DEAD_CELL

		let livingNeighbors be getLivingNeighborCount: currentState xCoord yCoord

		let isLivingAndStable be currentCellIsLiving and (:: livingNeighbors isBetween 1 4)
		let isReproducing be currentCellIsDead and (livingNeighbors isEqualTo 3)

		if isLivingAndStable or isReproducing
			LIVE_CELL
		else
			DEAD_CELL
		end
	end

	declare function getNewBoard
		let width be 25
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

    declare function runGameOfLife
        let currentBoard be call getNewBoard

        call clearScreen
        
        print: "Starting board (randomized):"
        printBoard: currentBoard
        wait: 2
        
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
    end
        
    declare function startGameOfLife withParameters countdown
        call clearScreen
        
        print: "*************************"
        print: "* Conway's Game of Life *"
        print: "*************************"
        
        print: ""
        print: "This is Conway's Game of Life. It is a visual, self-"
        print: "evolving board called a cellular automaton. This board"
        print: "is 25 x 15 which is just big enough to see some"
        print: "interesting things happen."
        print: ""
        
        if countdown isEqualTo 0
        	call runGameOfLife
        else
            print: join: "Starting in " countdown " seconds"
            wait: 1
            startGameOfLife: (countdown - 1)
        end
    end

    startGameOfLife: 10
end`;

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
    define ROCK as "r"
    define PAPER as "p"
    define SCISSORS as "s"
	define WINS as "wins"
	define LOSSES as "losses"
	define TIES as "ties"

	define PLAY_OPTIONS as newArray: ROCK PAPER SCISSORS
	declare function contains withParameters values testValue
		let valueWasFound be false
		let currentIndex be 1
		let valuesLength be lengthOf: values

		repeat while (not: valueWasFound) and (currentIndex isLessOrEqualTo valuesLength)
			let currentValue be readFrom: values currentIndex

			update currentIndex to currentIndex + 1
			update valueWasFound to currentValue isEqualTo testValue
		end
	end

    declare function displayScore withParameters scores
		let wins be readFrom: scores WINS
		let losses be readFrom: scores LOSSES
		let ties be readFrom: scores TIES

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

	declare function promptUser withParameters message
		print: message
		call readKey
	end

    declare function wasGameATie withParameters userChoice computerChoice
        (userChoice isEqualTo computerChoice)
    end

    declare function getUserChoice
        let userChoice be ""

        repeat while not: (:: PLAY_OPTIONS contains userChoice)
			print: ""
            update userChoice to toLowerCase: (promptUser: "Press a key: (r)ock, (p)aper, (s)cissors")
        end
    end

    declare function haveRematch withParameters gameMessage
        let rematch be ""
		let validResponses be (newArray: "y" "n")

        repeat while not: (:: validResponses contains rematch)
			print: ""
            update rematch to toLowerCase: (promptUser: "Rematch? (press a key y/n)")
        end

        (rematch isEqualTo "y")
    end

    declare function updateScoreAndGetMessage withParameters scores userChoice computerChoice
        if (didUserWin: userChoice computerChoice)
			let winsCount be readFrom: scores WINS
            updateOn: scores WINS (winsCount + 1)

            "You won!"
        else if (wasGameATie: userChoice computerChoice)
			let tiesCount be readFrom: scores TIES
            updateOn: scores TIES (tiesCount + 1)

            "Tie game."
        else
			let lossesCount be readFrom: scores LOSSES
            updateOn: scores LOSSES (lossesCount + 1)

            "You lost, better luck next time."
        end
    end

	declare function playRockPaperScissors
        let playAgain be true

		let scores be (newDictionary:)

		setOn: scores WINS 0
		setOn: scores LOSSES 0
		setOn: scores TIES 0

        repeat while playAgain
            displayScore: scores

            let computerChoice be readFrom: PLAY_OPTIONS (random: 1 4)
            let userChoice be (call getUserChoice)

           print: join: "The computer chose: " computerChoice
            print: join: "You chose: " userChoice

            let message be updateScoreAndGetMessage: scores userChoice computerChoice

            print: message

            update playAgain to haveRematch: message
        end

        displayScore: scores
	end

	# Run that program!
	call playRockPaperScissors
end`;

	const coinToss = `begin
	define sides as newArray: "Heads" "Tails"

	call clearScreen

	print: "Flipping coin..."
	wait: 0.5 # wait so people can read the message

	let flipResult be random: 1 3
	let flipOutput be readFrom: sides flipResult
	
	call clearScreen

	print: "Coin Toss Result"
	print: "----------------"
	print: flipOutput
end`;

	const helloWorld = `begin
	print: "Hello, World!"
end`;

	return {
		"Hello World": helloWorld,
		"Coin Toss": coinToss,
		"Monty Python": montyPython,
        "Rock, Paper, Scissors": rockPaperScissors,
        "To Do List": toDoList,
		"Game of Life": gameOfLife,
		"Rule 110": rule110
	}
})();

