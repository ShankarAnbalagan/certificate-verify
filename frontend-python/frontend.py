import urllib as url
import pandas
import json

def add_data(path_to_file):
    login_url='https://polar-reaches-87686.herokuapp.com/users/login'
    login_data=url.parse.urlencode({
            "userName":"username",
            "password":"password"
        }).encode()
    login_response=url.request.urlopen(url=login_url, data=login_data).read().decode('utf-8')
    user_token=(json.loads(login_response))['data']['userToken']
    #print(user_token)
    
    f=pandas.read_excel(path_to_file).to_json(orient='records')
    add_data_url='https://polar-reaches-87686.herokuapp.com/data/add'
    add_data=url.parse.urlencode({
                "usertoken":user_token,
                "data":f
            }).encode()
    add_data_response=url.request.urlopen(url=add_data_url, data=add_data).read().decode('utf-8')
    #print(add_data_response)
    
    logout_url='https://polar-reaches-87686.herokuapp.com/users/logout/'+user_token
    logout_response=url.request.urlopen(logout_url)
    #print(logout_response.read().decode('utf-8'))
    
    return (json.loads(add_data_response)['data']['result'])
