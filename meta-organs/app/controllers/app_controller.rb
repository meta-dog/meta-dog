class AppController < ApplicationController
  def index
    @apps = App.all
    render json:@apps
  end
end
