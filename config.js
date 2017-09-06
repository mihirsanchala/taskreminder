module.exports = function(){
    switch(process.env.NODE_ENV){
        
        case 'prod':
            return {
                session:{
                    name:   'taskReminderProd',
                    secret: 'Xvqtu56Zx'
                },
                mailer:{
                    from:   'Task Reminder <noreply@taskreminder.com>',
                    host:   '',
                    port:   25,
                    transportMethod:   'SMTP'
                },
                db:{
                    url: 'mongodb://localhost:27017/taskReminder',
                    user: '',
                    pass: ''
                }
            };

        default:
            return {
                session:{
                    name:   'taskReminderDev',
                    secret: 'ZvrQW28Mk'
                },
                mailer:{
                    from:   'Task Reminder Dev <noreply@taskreminderdev.com>',
                    host:   '',
                    port:   25,
                    transportMethod:   'SMTP'
                },
                db:{
                    url: 'mongodb://localhost:27017/taskReminderDev',
                    user: '',
                    pass: ''
                }
            };
    }
};