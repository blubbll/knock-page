console.clear();

//get
const { ko, page } = window;
//set
let { model } = window;

page.configure({ window: window });

ko.applyBindings(
  new (function() {
    // proxyfying
    var self = this;
    //Data
    self.folders = ["Inbox", "Archive", "Sent", "Spam"];
    self.chosenFolderId = ko.observable();
    self.chosenFolderData = ko.observable();
    self.chosenMailData = ko.observable();

    // Behaviours
    self.goToFolder = folder => {
      //page(`/folder/${folder}`)

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

    //expose model func
    model = this;
  })()
);
//go to default path
model.goToFolder("Inbox");
/*page('/', index)
page('/user/:user', show)
page('/user/:user/edit', edit)
page('/user/:user/album', album)
page('/user/:user/album/sort', sort)
page('*', notfound)
page()*/
