app.views.CommentStream = app.views.Base.extend({

  templateName: "comment-stream",

  className : "comment_stream",

  events: {
    "submit form": "createComment",
    "focus .comment_box": "commentTextareaFocused",
    "keyup .comment_box": "checkForComment",
    "click .toggle_post_comments": "expandComments"
  },


  initialize: function(options) {
    this.model.comments.bind('add', this.appendComment, this);
  },

  postRenderTemplate : function() {
    this.$("textarea").placeholder();
    this.model.comments.each(this.appendComment, this);

    // add autoexpanders to new comment textarea
    this.$("textarea").autoResize({'extraSpace' : 0});
  },

  presenter: function(){
    return _.extend(this.defaultPresenter(), {
      moreCommentsCount : (this.model.get("comments_count") - 3),
      showExpandCommentsLink : (this.model.get("comments_count") > 3),
      commentsPresent : this.commentsPresent()
    })
  },

  checkForComment: function(evt) {
    if(this.$(".comment_box").val()) {
      this.$(".comment_submit").removeAttr('disabled');
    } else {
      this.disableCommentSubmit();
    }
  },

  disableCommentSubmit: function(){
    this.$(".comment_submit").attr('disabled', 'true');
  },

  commentsPresent : function() {
    return this.model.get("comments_count") > 0;
  },

  createComment: function(evt) {
    if(evt){ evt.preventDefault(); }

    this.model.comments.create({
      "text" : this.$(".comment_box").val()
    });

    this.$(".comment_box").val("")
    this.disableCommentSubmit(evt);
    return this;
  },

  appendComment: function(comment) {
    // Set the post as the comment's parent, so we can check
    // on post ownership in the Comment view.
    comment.set({parent : this.model.toJSON()})

    this.$(".comments").append(new app.views.Comment({
      model: comment
    }).render().el);
  },

  commentTextareaFocused: function(evt){
    this.$("form").removeClass('hidden').addClass("open");
  },

  expandComments: function(evt){
    if(evt){ evt.preventDefault(); }

    var self = this;
    this.model.comments.fetch({
      success : function(){
        self.model.set({all_comments_loaded : true});
        self.render();
      }
    });
  }

});
