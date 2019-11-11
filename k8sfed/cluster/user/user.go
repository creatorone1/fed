package sc

import (
	_ "github.com/Go-SQL-Driver/MySQL"
	"github.com/rs/xid"
    "database/sql"
	"fmt"
	"k8sfed/cluster"
)

type User struct{
	Id string
	Name  string
	Status boolean
	Password string
	Manager boolean
	Permission *Permission
}

type Permission struct{
	Fedpermission  boolean
	Clusterpermission string
	Modulepermission string
}

func Newuser(name,password string, status,manager,fedpermission boolean, clusterpermission, modulepermission string) *User{
	permission := &Permission{
		Fedpermission: fedpermission,
		Clusterpermission: clusterpermission,
		Modulepermission: modulepermission,
	}
    id := xid.New()
	return &User{
		Id : id,
		Name: name,
		Status: status,
		Password: password,
		Manager: manager,
		Permission: permission,
	}
}

func Connect(){
	db, err := sql.Open("mysql", "url?charset=utf8")
    checkErr(err)
}

func Add(usr User){
	stmt, err := db.Prepare("INSERT user_info SET id=?,name=?,status=?,password=?,manager=?,fedpermission=?,clusterpermission=?,modulepermission=?")
    checkErr(err)

    res, err := stmt.Exec(usr.Name, usr.Status, usr.Password, usr.Manager, usr.Fedpermission, usr.Clusterpermission, usr.Modulepermission)
    checkErr(err)
}

func QueryUsrClusterPermission(id string, clustername string) boolean{
	rows, err := db.Query("SELECT * FROM user_info")
    checkErr(err)
    var usr User
    for rows.Next() {
        err = rows.Scan(&usr.id, &usr.Name, &usr.Status, &usr.Password, &usr.Manager, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission)
        if(usr.id==id){
            if(usr.Manager==1){
    			return 1
    		}else if(usr.Clusterpermission.indexOf(clustername)== -1){
    			return 0
   			}else if(usr.Clusterpermission.indexOf(clustername)1= -1){
    			return 1
   			}
        }
        checkErr(err)
    }
}

func QueryUsrFedPermission(id string) boolean{
	rows, err := db.Query("SELECT * FROM user_info")
    checkErr(err)
    var usr User
    for rows.Next() {
        err = rows.Scan(&usr.id, &usr.Name, &usr.Status, &usr.Password, &usr.Manager, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission)
        if(usr.id==id){
            if(usr.Manager==1){
    			return 1
    		}else if(usr.Fedpermission == 0){
    			return 0
   			}else if(usr.Fedpermission == 1){
    			return 1
   			}
        }
        checkErr(err)
    }
}

func QueryUsrModulePermission(id string, modulename string) boolean{
	rows, err := db.Query("SELECT * FROM user_info")
    checkErr(err)
    var usr User
    for rows.Next() {
        err = rows.Scan(&usr.id, &usr.Name, &usr.Status, &usr.Password, &usr.Manager, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission)
        if(usr.id==id){
            if(usr.Manager==1){
    			return 1
    		}else if(usr.Modulepermission.indexOf(modulename)== -1){
    			return 0
   			}else if(usr.Modulepermission.indexOf(modulename)1= -1){
    			return 1
   			}
        }
        checkErr(err)
    }
}


func Delete(id string){
	stmt, err = db.Prepare("delete from user_info where id=?")
    checkErr(err)

    res, err = stmt.Exec(name)
    checkErr(err)
}

func Update(usr User, id string){
	stmt, err := db.Prepare("INSERT user_info SET name=?,status=?,password=?,manager=?,fedpermission=?,clusterpermission=?,modulepermission=? where id=?")
    checkErr(err)

    res, err := stmt.Exec(usr.Name, usr.Status, usr.Password, usr.Manager, usr.Fedpermission, usr.Clusterpermission, usr.Modulepermission)
    checkErr(err)

    affect, err := res.RowsAffected()
    checkErr(err)
}


