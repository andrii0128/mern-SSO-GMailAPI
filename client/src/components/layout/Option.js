const options = {
    render: (message, onConfirm, onCancel) => {
      return (
        <div className="confirm-dialog-container">
          <h5 className="text-center"><i class="fa fa-exclamation-circle"/>&nbsp;&nbsp;{message} </h5>
          <div className="button-container">
            <button className="btn-reverse" onClick={onConfirm}> Yes </button>
            <button className="btn-reverse" onClick={onCancel}> No </button>
          </div>
        </div>
      );
    }
  };

export default options;