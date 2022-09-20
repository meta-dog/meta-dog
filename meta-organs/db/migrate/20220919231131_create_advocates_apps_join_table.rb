class CreateAdvocatesAppsJoinTable < ActiveRecord::Migration[7.0]
  def change
    create_join_table :apps, :advocates

  end
end
