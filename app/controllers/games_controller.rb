class GamesController < ApplicationController

  def index
    games = Game.all
    render json: games
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def create
    game = Game.create(game_params)
    render json: game, status: 201
  end

  private

  def game_params
    params.require(:game).permit(state: [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end