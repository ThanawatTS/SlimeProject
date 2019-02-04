<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <router-link to="/signup">
            <h1>Sign Up</h1>
        </router-link>
        <router-link to="/signin">
            <h1>Sign In</h1>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'dashboard',
    data () {
        return {
        }
    }
}
</script>
