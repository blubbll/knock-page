const api = `${location.protocol}//${location.href.split("//")[1].split("/")[0]}`;
console.clear();

function WebmailViewModel() {
    // Data
    var self = this;
    self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
    self.chosenFolderId = ko.observable();
    self.chosenFolderData = ko.observable();
    self.chosenMailData = ko.observable();

    // Behaviours    
    self.goToFolder = folder => {
        self.chosenFolderId(folder);
        //stop showing mail
        self.chosenMailData(null);
        //get data
        fetch(`/mail?folder=${folder||null}`).then(r => r.json())
            .then(self.chosenFolderData);
    };

    self.goToMail = mail => {

        self.chosenFolderId(mail.folder);
        //stop showing folder
        self.chosenFolderData(null);
        //get data
        fetch(`/mail?mailId=${mail.id||null}`).then(r => r.json())
            .then(self.chosenMailData);

    }

    self.goToFolder('Inbox');
};

ko.applyBindings(new WebmailViewModel());


page('/', index)
page('/user/:user', show)
page('/user/:user/edit', edit)
page('/user/:user/album', album)
page('/user/:user/album/sort', sort)
page('*', notfound)
page()