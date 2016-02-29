class RemoveForCommentFromTags < ActiveRecord::Migration
  def change
    remove_column :tags, :for_comment, :boolean
  end
end
