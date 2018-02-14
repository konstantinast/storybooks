const moment = require('moment');

module.exports = {
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
            return new_str + '...';
        }
        return str;
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
    // Can be called in .handlebar template like so:
    // {{#select var_named_selected_value}}
    select: function(selected, options){        
        return options.fn(this) // get innerHTML which is enclosed by hbs #select helper
            // Remove the value that is set by default
            .replace( new RegExp(/[\s]{0,}selected(?:=['"].*['"]){0,}/), '')
            // Add value to that option which is currently select
            .replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')

        ;
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser === loggedUser) {
            if (floating) {
                return `
                    <a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red">
                        <i class="fa fa-pencil"></i>
                    </a>
                `;
            } else {
                return `
                    <a href="/stories/edit/${storyId}">
                        <i class="fa fa-pencil"></i>
                    </a>
                `;
            }
        } else {
            return '';
        }
    }
};