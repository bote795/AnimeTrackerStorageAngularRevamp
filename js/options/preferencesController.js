app.controller('userPreferences', ['userSrv', '$scope',
    function(userSrv, $scope)
    {
        this.newtab = userSrv.get().newtab | false;
        this.choices = [
            {
                value: true,
                text: "Open new tab"
            },

            {
                value: false,
                text: "open as a Popup"
            }
        ];
        this.onChanged = function(val)
        {
            this.newtab = val;
            userSrv.edit(
            {
                newtab: this.newtab
            });
            userSrv.save();
            chrome.runtime.sendMessage(
            {
                method: "updatePopup",
                newtab: this.newtab
            });
        };
    }
]);
