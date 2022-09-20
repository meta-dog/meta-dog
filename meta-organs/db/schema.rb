# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_09_19_231131) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "advocates", force: :cascade do |t|
    t.string "meta_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "advocates_apps", id: false, force: :cascade do |t|
    t.bigint "app_id", null: false
    t.bigint "advocate_id", null: false
  end

  create_table "apps", force: :cascade do |t|
    t.string "app_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
