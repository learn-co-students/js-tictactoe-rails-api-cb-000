class GamesController < ApplicationController

  def create
    @game = Game.create(game_params)
    render json: @game
  end

  def show
  	@game = Game.find(params[:id])
  end

  private

  	def game_params
  		params.require(:game).permit(:state)
  	end

end