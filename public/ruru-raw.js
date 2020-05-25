  const ruru = (ctx, cb, param) => {
    if (!model.routed) {
      model.routed = true;
      cb(param);
    }

    if (ctx.state.path !== model.state.path) {
      cb(param, true);
    }
    model.state.path = ctx.state.path;
  };