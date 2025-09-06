import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { register } from "../services/faculty"

export function Register() {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [roleId, setRoleId] = useState("")


    // get the navigation function
    const navigate = useNavigate()

    const onRegister = async () => {
        if (name.length == 0) {
            toast.warn('enter name')
        } else if (email.length == 0) {
            toast.warn('enter email')
        } else if (password.length == 0) {
            toast.warn('enter password')
        } else if (!roleId) {

            toast.warn('Select role')

        } else {
            //make the api call
            const result = await register(name, email, password, roleId)
            console.log("API result:", result) // debug log


            if (result['status'] === 'success') {
                toast.success('Successfully registered the user')
                navigate('/')
            } else {
                toast.error(result['error'] || 'Someting went wrong')
            }

        }

    }
    return (
        <>
            <h1 className="title" >Register</h1>

            <div className="row">
                <div className="col"></div>
                <div className="col"> <div className='form'>

                    <div className='mb-3'>
                        <label htmlFor=''>Name</label>
                        <input onChange={e => setname(e.target.value)}
                            type='text'
                            className="form-control"
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor=''>Email</label>
                        <input onChange={e => setemail(e.target.value)}
                            type='email'
                            placeholder='abc@test.com'
                            className="form-control"
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor=''>Password</label>
                        <input onChange={e => setpassword(e.target.value)}
                            type='password'
                            placeholder='XXXXXXXXX'
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            className="form-control"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                        >
                            <option value="">-- Select Role --</option>
                            <option value="1">Trainer</option>
                            <option value="2">Lab Mentor</option>
                            <option value="3">Course Cordinator</option>
                        </select>
                    </div>

                    <div className='mb-3'>
                        <div>Already got an account? <Link to='/login'>login here</Link></div>
                        <button onClick={onRegister} className='btn btn-primary mt-2'>
                            Register
                        </button>
                    </div>

                </div>
                </div>
                <div className="col"></div>
            </div>


        </>
    )
}

export default Register