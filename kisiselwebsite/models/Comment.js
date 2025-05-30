import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Lütfen yorum içeriği giriniz'],
      maxlength: [1000, 'Yorum 1000 karakterden uzun olamaz'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
