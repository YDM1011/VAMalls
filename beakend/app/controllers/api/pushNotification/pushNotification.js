module.exports = (backendApp, router) => {
    // var fcm = require('fcm-notification');
    // var FCM = new fcm({
    //         "type": "service_account",
    //         "project_id": "airy-gamma-253812",
    //         "private_key_id": "ea2dd105390de8d3a146ede138ca20739176a0a5",
    //         "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1SvketpEUZpAI\noBNK9i8bx+gCD+oM/QSVRsFFWLQ7Y8t4vM/EqPNCAzghnohsCj4myCWe/3c14TtF\n/n/gqfeapxDkFvnJcgzASE2c2+mk5EO5asmdOA627I6Oag25LPzRUE4C+o8hftH1\nlIcxJ26FftY8XrhARQxV4l3FMKTAHuxbkG/wRLybdjy7nfH7no7xfwPSTcSNqfig\nIH6U0kE+4bVzFknO0Lt54gLkkXQoCxM6uNqabx1ha/znD5qTvM79JIKaH4sxrmDz\nD8svMJ7Dv7RkXs5ASpErpFMHbQqhweCZRHUuTPREIy2bN1p+EzZ5ROOLwF2U6Dh3\nWSfpRDbZAgMBAAECggEAP6ziG/3+rf4qB8WFkTYvrJ/FpvfE+qPhuLadyogR4aw2\n+qTCiu3WZvCvhetjOiNM2h1BTXun+MYvpfFyI8w++dRFE//X4v/KZ7zdecMp6K79\n9IGD59MZI/mpRm8Me+ZHtBLzG4u6uwaKoyl0ZHjXkk7O22xfZb96yi2URt7DdvCu\nEkq3yrnp87CQiRfTTFSGpyZeZL6f66q+Jj5TYzrJpMHVDZUJfAkrcyfi8cG2mP0P\nVK7pSYL8dJToy8xe5fJncdH5LdL9EgEoys0rnFl4iXwkndxt25BQcqTRcysAZ4uR\nWb2k+WF/ZJK5k+VHpjO7oxutu90ivjWwVrKeKeSx4wKBgQDhSirmcZgRVld191ar\nMwgq46XVIDf02OMQaLBnGUrpY3L9h3rRAeqKOAWiTRfMxlhuZd9wXCNGOf7+WWGG\nDnJtuCiRDERHHl1VqKMqKqf8h5+Tiw27oVC9yJE6qnnEeNbUyNS5x4p/YLbSKnvI\nEQp0OzTMvn/2c79GJW3Fo+LkxwKBgQDOAXeqCAc1A5kITziCJIwl7AQ9H+BXy+yu\n6zYhcPNAN8qKIOlfIZUBdYQ0fOM1omU0+tweLFfXRSCQMroC5pP2AA3X90DEcgCc\nNbBQudRsIRqVR5ulPFT4xbmMqSCh2yJ/wgMOVvH1gIYsjm8pSgOShwcFcM4+wTLt\ndKK7+hEnXwKBgH8yquoVNLCFOThHf82FMJVWlqiwWieJ1RnModxz8VG4bpIqTfN3\ny35ihvvN3yQk0IT0S6VawCfEUu40dNWFjqHYGj9a16n3wOa+IfGKx/HSeQyKtCQ9\nviKI/UZMPhfpyhG1mjWSLeYhKteaWOzqgiaBzxvSatkxHMt0EnhGQbK9AoGAFC1a\nniHJKu0eSQ0RWNXhkDlMtPvxSkgj94H8PExG1wxf3yWYFgRBBvKOr2FoE7HDPeww\nMRhgxin0JYuCYpRY+6hHstZ51oPgAWzUxyNcZfbcFrD70rRVEkSzhs5t7sx61Y6Y\nJAhqDIS5H5YX1zBzpx9olaTV3pmntlBNPCIjGfsCgYAg1MqB5PUkY8i7/mZaV9ci\nuBavd3lV2OPQCPw+hHRL3tSeZpM29lFd0PbKzI1BylHoHMpzDEy00VZ7b3PmUI+a\n3Qm6GQUounzbb0R6YiW5VHFdqIj63AONgdh4O0q3gI8a1iypgaymNgbJemgkSgra\n/xuBe3rVxFPV1Da/GNygTg==\n-----END PRIVATE KEY-----\n",
    //         "client_email": "firebase-adminsdk-ddoko@airy-gamma-253812.iam.gserviceaccount.com",
    //         "client_id": "112624394828529010854",
    //         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    //         "token_uri": "https://oauth2.googleapis.com/token",
    //         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    //         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ddoko%40airy-gamma-253812.iam.gserviceaccount.com"
    //     }
    // );

    // var message = {
    //     data: {
    //         id: 'tr'
    //     },
    //     notification:{
    //         title : 'Title of notification',
    //         body : 'Body of notification',
    //     },
    //     android: {
    //         notification: {
    //             sound: "mynoise"
    //         },
    //         priority:"high"
    //
    //     },
    //     topic: "all",
    // };
    router.get('/pushNotification', [], (req,res,next) => {

        backendApp.service.fcm.send({
            title : 'Title of notification',
            body : 'Body of notification',
        })
    });
};
