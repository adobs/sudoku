import edsudoku
import pickle

def generate_board():
    board = edsudoku.generate(3, 3)

    board_list = []

    for row in xrange(board.rows):
        board_row = []
        for col in xrange(board.cols):
            board_row.append(board.problem[row, col])
        board_list.append(board_row)

    with open("boardpickle/board-file.pickle", 'wb') as f:
        pickle.dump(board, f)

    return board_list


def solved_board():
    board = pickle.load("boardpickle/board-file.pickle")

    solved_board = []
    for row in xrange(board.rows):
        for col in xrange(board.cols):
            solved_board.append(board.solution[row, col])

    return {"solution": solved_board}