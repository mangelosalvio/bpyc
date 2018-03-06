db.residents.createIndex({ 
    'name' : 'text', 
    'address' : 'text' , 
    'cases.offense_committed' : 'text', 
    'current_status' : 'text',
    'age' : 1
})