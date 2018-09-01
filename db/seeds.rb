Game.destroy_all

Game.create(state: ["X", "O", "X", "", "O", "O", "", "", "X"])
Game.create(state: ["O", "", "O", "", "X", "X", "O", "", ""])
Game.create(state: ["O", "", "O", "", "X", "X", "", "X", ""])

p "Created #{Game.count} Game(s)"
