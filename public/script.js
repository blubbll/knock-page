console.clear();

//selectors
const $ = document.querySelector.bind(document),
  $$ = document.querySelectorAll.bind(document);

//get
const { ko, page } = window;
//set
let { model } = window;

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
    }

    // Behaviours
    {
      self.goToIndex = () => {
        self.chosenFolderData(null);
        self.chosenMailData(null);
      };

      self.goToFolder = folder => {
        page(`/folder/${folder}`);

        self.chosenFolderId(folder);
        //stop showing mail
        self.chosenMailData(null);
        //get data
        fetch(`/mail?folder=${folder || null}`)
          .then(r => r.json())
          .then(self.chosenFolderData);
      };

      self.goToMail = mail => {
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
    !model.routed && [
      (model.routed = true),
      model.goToFolder(ctx.params.folder)
    ];
    console.log(ctx)
  });
}
//setup clientside history navigation
{
  window.onpopstate = (ev) =>{
    //console.log(ev.state.path)
    //page(ev.state.path)
  }
}

//execute route from server (or default route)
page(initialpath === "/" ? "/folder/Inbox" : initialpath);
