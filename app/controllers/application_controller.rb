class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  # before_filter :authenticate
  

  def authenticate
    unless ENV['HTTP_AUTH_USERNAME'].blank? or ENV['HTTP_AUTH_PASSWORD'].blank?
      authenticate_or_request_with_http_basic do |username, password|
        username == ENV['HTTP_AUTH_USERNAME'] && password == ENV['HTTP_AUTH_PASSWORD']
      end
    end
  end

  def after_sign_in_path_for(resource)
    request.env['omniauth.origin'] || stored_location_for(resource) || service_index_path
  end
end
