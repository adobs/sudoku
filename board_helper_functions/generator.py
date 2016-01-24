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
    log_file = open("boardpickle/board-file.pickle")
    board = pickle.load(log_file)

    solved_board = []
    for row in xrange(board.rows):
        board_row = []
        for col in xrange(board.cols):
            board_row.append(board.solution[row, col])
        solved_board.append(board_row)

    log_file.close()
    return solved_board