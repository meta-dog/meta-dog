require "test_helper"

class AppControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get app_index_url
    assert_response :success
  end
end
