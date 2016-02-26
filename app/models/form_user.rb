class FormUser < User
  attr_accessor :current_password
  
  validates_presence_of   :email, if: :email_required?
  validates_uniqueness_of :email, allow_blank: true, if: :email_changed?
  validates_format_of     :email, with: Devise.email_regexp, allow_blank: true, if: :email_changed?

  validates_presence_of     :password, if: :password_required?
  validates_confirmation_of :password, if: :password_required?
  validates_length_of       :password, within: Devise.password_length, allow_blank: true

  def password_required?
    if self.identities.find_by(provider: "twitter").nil?
      false
    else
      return false if email.blank? || !persisted? || !password.nil? || !password_confirmation.nil?
    end
  end

  def email_required?
    if self.identities.find_by(provider: "twitter").nil?
      true
    else
      false
    end
  end
end