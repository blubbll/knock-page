console.clear();

//selectors
const $ = document.querySelector.bind(document),
  $$ = document.querySelectorAll.bind(document);

//get
const { ko, page } = window;
//set
let { model, ruru } = window;

//custom routing extension
ruru = args => {
  if (!args.first) {
    console.log("%c Routing to", "background: #222; color: lime", {
      path: args.ctx.path,
      param: args.param || null
    });
    if (!model.routed) {
      args.cb(args.param, true);
      model.routed = true;
    }

    if (args.ctx.state.path !== model.state.path) {
      args.cb(args.param, true);
    }
    model.state.path = args.ctx.state.path;
  } else {
    console.log("%c Routing VIA FIRST to", "background: #222; color: lime", {
      path: model.state.path
    });
    model.firstrouted = true;
    page.replace(model.state.path);
  }
};

//inherited path from server
const initialpath = $("meta[name=path").getAttribute("content");

//apparently page.js doesn't work without this lol
page.configure({ window: window });

//setup knock model
ko.applyBindings(
  new (function() {
    // proxyfying
    var self = this;
    //Data
    {
      self.folders = ["Inbox", "Archive", "Sent", "Spam"];
      self.chosenFolderId = ko.observable();
      self.chosenFolderData = ko.observable();
      self.chosenMailData = ko.observable();
      self.routed = false;
      self.state = {};
    }

    // Behaviours
    {
      self.goToIndex = () => {
        self.chosenFolderData(null);
        self.chosenMailData(null);
      };

      self.goToFolder = (folder, nonav) => {
        nonav !== true && page(`/folder/${folder}`);

        self.chosenFolderId(folder);
        //stop showing mail
        self.chosenMailData(null);
        //get data
        fetch(`/mail?folder=${folder || null}`)
          .then(r => r.json())
          .then(self.chosenFolderData);
      };

      self.goToMail = (mail, nonav) => {
        nonav !== true && page(`/mail/${mail.id}`);

        console.log("going to mail", mail);

        self.chosenFolderId(mail.folder);
        //stop showing folder
        self.chosenFolderData(null);

        //get data
        fetch(`/mail?mailId=${mail.id || null}`)
          .then(r => r.json())
          .then(self.chosenMailData);
      };
    }

    //expose model func
    model = this;
  })()
);

//setup Routes
{
  page("/", model.goToIndex);
  page("/folder/:folder", (ctx, next) => {
    ruru({ ctx, cb: model.goToFolder, param: ctx.params.folder });
  });
  page("/mail/:mail", (ctx, next) => {
    ruru({ ctx, cb: model.goToMail, param: { id: ctx.params.mail } });
  });
}

//execute route from server (or default route)
{
  const _path = initialpath === "/" ? "/folder/Inbox" : initialpath;
  model.state = { path: _path };

  ruru({ cb: model.goToFolder, param: _path, first: true });
}
